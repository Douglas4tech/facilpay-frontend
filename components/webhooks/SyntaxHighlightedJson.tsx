'use client';

import React, { useState } from 'react';

interface SyntaxHighlightedJsonProps {
  data: unknown;
  maxHeight?: string;
  showCopy?: boolean;
}

export default function SyntaxHighlightedJson({
  data,
  maxHeight = 'max-h-96',
  showCopy = true,
}: SyntaxHighlightedJsonProps) {
  const [copied, setCopied] = useState(false);

  const rawJson = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(rawJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Tokenize and color JSON tokens safely
   */
  const formatJson = (jsonStr: string) => {
    // Regex matches: "keys":, "strings", numbers, booleans, null
    const regex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    let keyIdx = 0;

    while ((match = regex.exec(jsonStr)) !== null) {
      // Unmatched prefix text (whitespace, brackets, braces, commas)
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text_${keyIdx++}`} className="text-zinc-500 dark:text-zinc-400">
            {jsonStr.substring(lastIndex, match.index)}
          </span>
        );
      }

      const token = match[0];

      if (/^"/.test(token)) {
        if (/:$/.test(token)) {
          // JSON Object Key (e.g. "order_id":)
          const keyName = token.slice(0, -1);
          parts.push(
            <span key={`k_${keyIdx++}`} className="text-[#0066FF] dark:text-[#55C2FF] font-semibold">
              {keyName}
            </span>
          );
          parts.push(
            <span key={`colon_${keyIdx++}`} className="text-zinc-400">
              :
            </span>
          );
        } else {
          // String Value (e.g. "settled")
          parts.push(
            <span key={`s_${keyIdx++}`} className="text-emerald-600 dark:text-emerald-400">
              {token}
            </span>
          );
        }
      } else if (/true|false/.test(token)) {
        // Boolean
        parts.push(
          <span key={`b_${keyIdx++}`} className="text-purple-600 dark:text-purple-400 font-semibold">
            {token}
          </span>
        );
      } else if (/null/.test(token)) {
        // Null
        parts.push(
          <span key={`n_${keyIdx++}`} className="text-zinc-400 dark:text-zinc-500 italic">
            {token}
          </span>
        );
      } else {
        // Number
        parts.push(
          <span key={`num_${keyIdx++}`} className="text-amber-600 dark:text-amber-400 font-mono font-medium">
            {token}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Remaining trailing text
    if (lastIndex < jsonStr.length) {
      parts.push(
        <span key={`trail_${keyIdx++}`} className="text-zinc-500 dark:text-zinc-400">
          {jsonStr.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="relative group rounded-xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs dark:border-zinc-800 text-zinc-100 overflow-hidden shadow-inner">
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-200 transition-colors shadow-sm z-10 flex items-center gap-1 cursor-pointer"
          title="Copy payload as JSON"
        >
          {copied ? (
            <>
              <span className="text-emerald-400 font-semibold">✓ Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy JSON</span>
            </>
          )}
        </button>
      )}

      <pre className={`overflow-auto ${maxHeight} leading-relaxed select-text font-mono text-[11px]`}>
        <code>{formatJson(rawJson)}</code>
      </pre>
    </div>
  );
}
