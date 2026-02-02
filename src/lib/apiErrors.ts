/**
 * API Error Handling Utilities
 * Provides retry logic, error classification, and user-friendly messages
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromResponse(response: Response, body?: unknown): APIError {
    const message = typeof body === 'object' && body && 'message' in body 
      ? String((body as { message: string }).message)
      : response.statusText || 'Request failed';
    
    const code = typeof body === 'object' && body && 'code' in body 
      ? String((body as { code: string }).code)
      : undefined;
    
    // Determine if error is retryable
    const retryable = response.status >= 500 || response.status === 429;
    
    return new APIError(message, response.status, code, retryable);
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: Error, attempt: number) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // Retry network errors and server errors
    if (error instanceof NetworkError) return true;
    if (error instanceof TimeoutError) return true;
    if (error instanceof APIError) return error.retryable;
    return false;
  },
  onRetry: () => {},
};

/**
 * Execute an async function with exponential backoff retry
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries,
    baseDelay,
    maxDelay,
    backoffFactor,
    retryCondition,
    onRetry,
  } = { ...DEFAULT_RETRY_CONFIG, ...config };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt < maxRetries && retryCondition(lastError, attempt)) {
        const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
        
        // Add jitter to prevent thundering herd
        const jitter = delay * 0.1 * Math.random();
        const totalDelay = delay + jitter;

        onRetry(lastError, attempt + 1);
        
        await new Promise((resolve) => setTimeout(resolve, totalDelay));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError;
}

interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
}

/**
 * Fetch with automatic timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
      }
      throw new NetworkError(error.message);
    }
    
    throw new NetworkError();
  }
}

/**
 * Enhanced fetch with retry and error handling
 */
export async function safeFetch<T = unknown>(
  url: string,
  options: FetchWithTimeoutOptions & RetryConfig = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, backoffFactor, retryCondition, onRetry, ...fetchOptions } = options;

  return withRetry(
    async () => {
      const response = await fetchWithTimeout(url, fetchOptions);

      if (!response.ok) {
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          // Response body might not be JSON
        }
        throw APIError.fromResponse(response, body);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) return null as T;

      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    },
    { maxRetries, baseDelay, maxDelay, backoffFactor, retryCondition, onRetry }
  );
}

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: Error): string {
  if (error instanceof NetworkError) {
    return 'Unable to connect. Please check your internet connection.';
  }

  if (error instanceof TimeoutError) {
    return 'The request is taking too long. Please try again.';
  }

  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please sign in to continue.';
      case 403:
        return 'You don\'t have permission to do this.';
      case 404:
        return 'The requested content was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'Something went wrong on our end. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Queue for storing failed requests to retry when back online
 */
interface QueuedRequest {
  id: string;
  url: string;
  options: RequestInit;
  timestamp: number;
  retries: number;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private storageKey = 'hifz_request_queue';

  constructor() {
    this.loadFromStorage();
    
    // Process queue when coming back online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.processQueue());
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch {
      // Storage might be full
    }
  }

  add(url: string, options: RequestInit) {
    const request: QueuedRequest = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      options,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(request);
    this.saveToStorage();
    
    return request.id;
  }

  remove(id: string) {
    this.queue = this.queue.filter((r) => r.id !== id);
    this.saveToStorage();
  }

  async processQueue() {
    if (!navigator.onLine || this.queue.length === 0) return;

    const toProcess = [...this.queue];
    
    for (const request of toProcess) {
      try {
        await fetch(request.url, request.options);
        this.remove(request.id);
      } catch {
        request.retries++;
        if (request.retries >= 3) {
          this.remove(request.id);
        }
      }
    }

    this.saveToStorage();
  }

  get pending() {
    return this.queue.length;
  }
}

export const requestQueue = new RequestQueue();
