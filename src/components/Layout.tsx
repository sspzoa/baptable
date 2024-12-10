import { DateNavigationProps, LayoutProps } from '@/types';
import { formatDate } from '@/utils/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => (
  <div className="flex items-center justify-center md:justify-between w-full">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
      밥{' '}
      <span className="text-base text-gray-500 font-normal">
        by{' '}
        <Link className="relative group inline-block" href="https://github.com/sspzoa" target="_blank" rel="noreferrer noopener">
          <span className="ease-in-out duration-300 hover:text-blue-400">sspzoa</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300" />
        </Link>
      </span>
    </h1>
    <div className="hidden md:flex overflow-hidden backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 px-4 py-2 rounded-xl border border-white/50">
      <code className="text-xs font-mono text-gray-600 select-text">https://밥.net/api/meal?date=yyyy-MM-dd</code>
    </div>
  </div>
);

const DateNavigation: React.FC<DateNavigationProps> = ({ date, handleDateChange }) => (
  <div className="overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 rounded-xl px-4 py-2 flex items-center justify-center border border-white/50">
    <button type="button" onClick={() => handleDateChange(-1)} className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-blue-100 before:to-purple-100 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out" aria-label="이전 날짜">
      <ChevronLeft className="w-5 h-5 text-blue-600 relative z-10" />
    </button>
    <div className="w-[220px] text-center">
      <span className="text-base font-medium px-4 text-gray-700">{formatDate(date)}</span>
    </div>
    <button type="button" onClick={() => handleDateChange(1)} className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-blue-100 before:to-purple-100 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out" aria-label="다음 날짜">
      <ChevronRight className="w-5 h-5 text-blue-600 relative z-10" />
    </button>
  </div>
);

const DateNavigationSkeleton: React.FC = () => (
  <div className="overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 rounded-xl px-4 py-2 flex items-center justify-center border border-white/50">
    <div className="p-1.5">
      <div className="w-5 h-5 bg-blue-200/50 rounded-lg" />
    </div>
    <div className="w-[220px] flex justify-center">
      <div className="animate-pulse w-[180px] h-6 bg-blue-200/50 rounded-lg" />
    </div>
    <div className="p-1.5">
      <div className="w-5 h-5 bg-blue-200/50 rounded-lg" />
    </div>
  </div>
);

interface ExtendedLayoutProps extends LayoutProps {
  initialLoading?: boolean;
}

export const Layout: React.FC<ExtendedLayoutProps> = ({ children, date, handleDateChange, initialLoading }) => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-100 to-purple-100 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 h-[calc(100dvh-4rem)]">
        <div className="flex flex-col md:flex-row gap-4">
          <Header />
        </div>
        {initialLoading ? (
          <DateNavigationSkeleton />
        ) : (
          <DateNavigation date={date} handleDateChange={handleDateChange} />
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};