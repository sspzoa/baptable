'use client';

import { useMealMenu, usePreloadMealMenu } from '@/hooks/useMealMenu';
import { selectedDateAtom } from '@/store/atoms';
import { MealCardProps, MealSwiperProps, MealMenu } from '@/types';
import { useAtom } from 'jotai';
import { ChevronLeft, ChevronRight, Coffee, ExternalLink, Moon, Utensils } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const [year, month, day] = date.split('-');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[dateObj.getUTCDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

const getNewDate = (currentDate: string, days: number): string => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultMealIndex = (): number => {
  const hour = new Date().getHours();
  if (hour < 9) return 0;
  if (hour < 20) return 1;
  return 2;
};

const MealCard: React.FC<MealCardProps> = ({ title, content, icon: Icon, isEmpty }) => {
  const menuItems = content.split('/').filter((item) => item.trim());

  return (
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 flex-1 border border-white/50">
      <div className="relative flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        {isEmpty ? (
          <div className="relative flex items-center justify-center flex-1 text-gray-500">급식 정보가 없습니다</div>
        ) : (
          <ul className="relative flex flex-col space-y-2 flex-1">
            {menuItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-center group/item text-gray-700 py-1 pl-3 relative hover:translate-x-2 transition-all duration-300">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                <Link
                  href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(
                    item.trim()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm hover:text-blue-600 transition-colors duration-300">
                  {item.trim()}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const MealSwiper: React.FC<MealSwiperProps> = ({ meals }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(getDefaultMealIndex());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < meals.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div
        className="flex-1 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="h-full">
          <MealCard {...meals[currentIndex]} />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {meals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 w-4"
                : "bg-blue-300"
            }`}
            aria-label={`${index + 1}번째 메뉴로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

interface LoadingSkeletonProps {
  widths?: string[];
  isMobile?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
                                                           widths = ['w-2/3', 'w-3/4', 'w-4/5', 'w-3/5'],
                                                           isMobile = false
                                                         }) => {
  const skeletons = [...Array(isMobile ? 1 : 3)].map((_, i) => (
    <div
      key={i}
      className="overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-4 flex-1 border border-white/50">
      <div className="animate-pulse flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-blue-200/50 rounded-xl" />
          <div className="h-7 w-16 bg-blue-200/50 rounded-lg" />
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="flex items-center py-1 pl-3 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-200/50" />
              <div className={`h-4 rounded-full bg-gradient-to-r from-blue-100/50 to-purple-100/50 ${widths[j]}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col md:flex-row gap-3 h-full">
      {skeletons}
    </div>
  );
};

const Header: React.FC = () => (
  <div className="flex items-center justify-between w-full">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
      밥{' '}
      <span className="text-base text-gray-500 font-normal">
        by{' '}
        <Link
          className="relative group inline-block"
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noreferrer noopener">
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

interface DateNavigationProps {
  date: string;
  handleDateChange: (days: number) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ date, handleDateChange }) => (
  <div className="overflow-hidden w-full backdrop-blur-xl bg-gradient-to-r from-white/70 to-white/50 rounded-xl px-4 py-2 flex items-center justify-center border border-white/50">
    <button
      type="button"
      onClick={() => handleDateChange(-1)}
      className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-blue-100 before:to-purple-100 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out"
      aria-label="이전 날짜">
      <ChevronLeft className="w-5 h-5 text-blue-600 relative z-10" />
    </button>
    <span className="text-base font-medium px-4 text-gray-700">{formatDate(date)}</span>
    <button
      type="button"
      onClick={() => handleDateChange(1)}
      className="p-1.5 rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-blue-100 before:to-purple-100 before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-100 transform hover:scale-110 transition-transform duration-300 ease-in-out"
      aria-label="다음 날짜">
      <ChevronRight className="w-5 h-5 text-blue-600 relative z-10" />
    </button>
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
  date: string;
  handleDateChange: (days: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, date, handleDateChange }) => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 h-[calc(100dvh-2rem)]">
        <div className="flex flex-col md:flex-row gap-4">
          <Header />
        </div>
        <DateNavigation date={date} handleDateChange={handleDateChange} />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

const MealDisplay: React.FC = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const { data: menu, error, isLoading } = useMealMenu();
  const { preloadDate } = usePreloadMealMenu();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateChange = (days: number) => {
    const newDate = getNewDate(selectedDate, days);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const nextDay = getNewDate(selectedDate, 1);
    const previousDay = getNewDate(selectedDate, -1);
    preloadDate(nextDay);
    preloadDate(previousDay);
  }, [selectedDate, preloadDate]);

  if (!mounted) {
    return (
      <Layout date={selectedDate} handleDateChange={handleDateChange}>
        <LoadingSkeleton isMobile={isMobile} />
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout date={selectedDate} handleDateChange={handleDateChange}>
        <LoadingSkeleton isMobile={isMobile} />
      </Layout>
    );
  }

  const defaultEmptyMeals: MealCardProps[] = [
    { title: '조식', icon: Coffee, content: "", isEmpty: true },
    { title: '중식', icon: Utensils, content: "", isEmpty: true },
    { title: '석식', icon: Moon, content: "", isEmpty: true }
  ];

  if (error || !menu) {
    return (
      <Layout date={selectedDate} handleDateChange={handleDateChange}>
        <div className="flex-1 h-full">
          <div className="hidden md:flex flex-row gap-3 h-full">
            {defaultEmptyMeals.map((meal) => (
              <MealCard key={meal.title} {...meal} />
            ))}
          </div>
          <div className="md:hidden h-full">
            <MealSwiper meals={defaultEmptyMeals} />
          </div>
        </div>
      </Layout>
    );
  }

  const meals: MealCardProps[] = [
    { title: '조식', content: menu.breakfast || '', icon: Coffee, isEmpty: !menu.breakfast },
    { title: '중식', content: menu.lunch || '', icon: Utensils, isEmpty: !menu.lunch },
    { title: '석식', content: menu.dinner || '', icon: Moon, isEmpty: !menu.dinner }
  ];

  return (
    <Layout date={selectedDate} handleDateChange={handleDateChange}>
      <div className="h-full flex flex-col">
        <div className="hidden md:flex flex-row gap-3 flex-1">
          {meals.map((meal) => (
            <MealCard key={meal.title} {...meal} />
          ))}
        </div>
        <div className="md:hidden flex-1">
          <MealSwiper meals={meals} />
        </div>
      </div>
    </Layout>
  );
};

export default MealDisplay;