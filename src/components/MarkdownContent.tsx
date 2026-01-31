'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Style strong/bold text
        strong: ({ children }) => (
          <strong className="text-gold-400 font-semibold">{children}</strong>
        ),
        // Style emphasis/italic
        em: ({ children }) => (
          <em className="text-night-200 italic">{children}</em>
        ),
        // Style paragraphs
        p: ({ children }) => (
          <p className="text-night-300 leading-relaxed mb-3 last:mb-0">{children}</p>
        ),
        // Style lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 text-night-300 mb-3">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 text-night-300 mb-3">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-night-300">{children}</li>
        ),
        // Style headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-night-100 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-night-100 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-night-100 mb-2">{children}</h3>
        ),
        // Style code
        code: ({ children }) => (
          <code className="bg-night-800 text-gold-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        ),
        // Style blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gold-500/30 pl-4 italic text-night-400 my-3">
            {children}
          </blockquote>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
