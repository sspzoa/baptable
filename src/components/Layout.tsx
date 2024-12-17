import { DateNavigationProps, LayoutProps } from '@/types';
import { formatDate } from '@/utils/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { Header } from '@/components/ui/Header';
import { CopyButton } from '@/components/ui/CopyButton';

interface ExtendedLayoutProps extends LayoutProps {
  initialLoading?: boolean;
}

const API_URL = 'https://밥.net/api/meal?date=yyyy-MM-dd';

const DateNavigation = memo(({ date, handleDateChange, isLoading }: DateNavigationProps & { isLoading?: boolean }) => (
  <div className="overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 rounded-xl px-4 py-2 flex items-center justify-center border border-white/50">
    <button
      type="button"
      onClick={() => handleDateChange(-1)}
      className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-orange-200/60 before:to-red-200/60 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out"
      aria-label="이전 날짜"
    >
      <ChevronLeft className="w-5 h-5 text-orange-600 relative z-10" />
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
      <ChevronRight className="w-5 h-5 text-orange-600 relative z-10" />
    </button>
  </div>
));

DateNavigation.displayName = 'DateNavigation';

export const Layout = memo(({ children, date, handleDateChange, initialLoading }: ExtendedLayoutProps) => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-orange-200 to-red-200 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 h-[calc(100dvh-4rem)] min-h-0">
        <div className="flex flex-col md:flex-row gap-4">
          <Header>
            <div className="hidden md:flex items-center overflow-hidden backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 py-2 px-4 rounded-xl border border-white/50">
              <code className="text-xs font-mono text-gray-600 select-text">{API_URL}</code>
              <CopyButton text={API_URL} />
            </div>
          </Header>
        </div>
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