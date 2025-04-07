import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
  filename: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-neutral-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center">
          <span className="bg-neutral-800 rounded px-2 py-1 text-xs font-mono text-gray-300">
            {filename}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 text-gray-300 px-2 py-1 rounded transition-colors duration-200"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={gruvboxDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'oklch(14.5% 0 0)',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
