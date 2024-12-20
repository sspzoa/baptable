import { DateNavigationProps, LayoutProps } from '@/types';
import { formatDate } from '@/utils/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { Header } from '@/components/ui/Header';
import { CopyButton } from '@/components/ui/CopyButton';
import Link from "next/link";

interface ExtendedLayoutProps extends LayoutProps {
  initialLoading?: boolean;
}

const API_URL = 'https://밥.net/api/meal?date=yyyy-MM-dd';

const DateNavigation = memo(({ date, handleDateChange, isLoading }: DateNavigationProps & { isLoading?: boolean }) => (
  <div
    className="overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 rounded-xl px-4 py-2 flex items-center justify-center md:justify-between border border-white/50">
    <div className='flex items-center justify-center'>
      <button
        type="button"
        onClick={() => handleDateChange(-1)}
        className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-orange-200/60 before:to-red-200/60 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out"
        aria-label="이전 날짜"
      >
        <ChevronLeft className="w-5 h-5 text-orange-600 relative z-10"/>
      </button>
      <div className="w-[220px] text-center">
      <span className={`text-base font-medium px-4 text-gray-700 transition-opacity duration-300 ease-in-out ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}>
        {formatDate(date)}
      </span>
      </div>
      <button
        type="button"
        onClick={() => handleDateChange(1)}
        className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-orange-200/60 before:to-red-200/60 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out"
        aria-label="다음 날짜"
      >
        <ChevronRight className="w-5 h-5 text-orange-600 relative z-10"/>
      </button>
    </div>
    <h1 className="hidden text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
      밥{' '}
      <span className="text-base text-gray-600 font-normal">
        by{' '}
        <Link
          className="relative group inline-block"
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="ease-in-out duration-300 hover:text-orange-500">sspzoa</span>
          <span
            className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 group-hover:w-full transition-all duration-300"/>
        </Link>
      </span>
    </h1>
    <div
      className="hidden md:flex items-center overflow-hidden backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 py-2 px-4 rounded-xl border border-white/50">
      <code className="text-xs font-mono text-gray-600 select-text">{API_URL}</code>
      <CopyButton text={API_URL}/>
    </div>
  </div>
));

DateNavigation.displayName = 'DateNavigation';

export const Layout = memo(({children, date, handleDateChange, initialLoading}: ExtendedLayoutProps) => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-orange-200 to-red-200 py-8 px-4">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-3 h-[calc(100dvh-4rem)] min-h-0">
        <DateNavigation
          date={date}
          handleDateChange={handleDateChange}
          isLoading={initialLoading}
        />
        <div className="flex-1 overflow-hidden min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';