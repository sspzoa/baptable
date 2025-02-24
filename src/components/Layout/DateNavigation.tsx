import { memo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Github, Copy, Check } from 'lucide-react';
import Link from "next/link";
import { DateNavigationProps } from '@/types';
import { formatDate } from '@/utils/date';

interface ExtendedProps extends DateNavigationProps {
  isLoading?: boolean;
}

const API_URL = 'https://api.밥.net/yyyy-MM-dd';

export const DateNavigation = memo(
  ({ date, handleDateChange, isLoading }: ExtendedProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(API_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }, []);

    return (
      <div className="overflow-hidden w-full backdrop-blur-xl bg-white/20 rounded-xl p-3 md:pl-4 md:p-2 flex items-center justify-center md:justify-between border border-white/30">
        {/* 왼쪽 화살표 */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleDateChange(-1)}
            className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-white/30 before:opacity-0 hover:before:opacity-100 transform hover:scale-110 transition-transform"
            aria-label="이전 날짜"
          >
            <ChevronLeft className="w-5 h-5 text-white relative z-10" />
          </button>

          {/* 날짜 표시 */}
          <div className="w-[220px] text-center">
            <span
              className={`text-lg font-bold px-4 text-white transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {formatDate(date)}
            </span>
          </div>

          {/* 오른쪽 화살표 */}
          <button
            type="button"
            onClick={() => handleDateChange(1)}
            className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-white/30 before:opacity-0 hover:before:opacity-100 transform hover:scale-110 transition-transform"
            aria-label="다음 날짜"
          >
            <ChevronRight className="w-5 h-5 text-white relative z-10" />
          </button>
        </div>

        {/* API URL & 버튼들 */}
        <div className="hidden md:flex items-center overflow-hidden py-2 pl-4 pr-2 rounded-xl border border-white/30 gap-4">
          <code className="text-xs font-mono text-white select-text">{API_URL}</code>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-white/30 before:opacity-10 hover:before:opacity-100 transform hover:scale-110 transition-transform"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-white relative z-10" />
              ) : (
                <Copy className="w-4 h-4 text-white relative z-10" />
              )}
            </button>
            <Link
              href="https://github.com/sspzoa"
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-white/30 before:opacity-10 hover:before:opacity-100 transform hover:scale-110 transition-transform"
              aria-label="View GitHub profile"
            >
              <Github className="w-4 h-4 text-white relative z-10" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

DateNavigation.displayName = 'DateNavigation';