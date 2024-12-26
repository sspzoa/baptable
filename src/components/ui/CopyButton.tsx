import { Check, Copy } from 'lucide-react';
import { memo, useState, useCallback } from 'react';

interface CopyButtonProps {
  text: string;
}

export const CopyButton = memo(({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="ml-4 p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-orange-200/60 before:to-red-200/60 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600 relative z-10" />
      ) : (
        <Copy className="w-4 h-4 text-red-600 relative z-10" />
      )}
    </button>
  );
});

CopyButton.displayName = 'CopyButton';