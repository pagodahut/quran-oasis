/**
 * Production-safe logger utility
 * Only logs in development mode (unless explicitly forced)
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Debug log - only shows in development
   */
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Info log - only shows in development
   */
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * Warning log - shows in all environments
   */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /**
   * Error log - shows in all environments
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};

export default logger;
