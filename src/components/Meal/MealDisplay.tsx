// src/components/Meal/MealDisplay.tsx
'use client';

import { memo, useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { selectedDateAtom } from '@/hooks/store/atoms';
import { useAtom } from 'jotai';
import { useMealMenu, usePreloadMealMenu } from '@/hooks/useMealMenu';
import { getDefaultMealAndDate, getNewDate } from '@/utils/date';
import { MealCardProps } from '@/types';
import { Coffee, Moon, Utensils } from 'lucide-react';
import { MealCard } from './MealCard';
import MobileMealDisplay from './MobileMealDisplay';

// 빈 데이터(조식/중식/석식)
const DEFAULT_EMPTY_MEALS: MealCardProps[] = [
  { title: '조식', icon: Coffee, content: "", isEmpty: true },
  { title: '중식', icon: Utensils, content: "", isEmpty: true },
  { title: '석식', icon: Moon, content: "", isEmpty: true }
];

const MealCardsDesktop = memo(({ meals }: { meals: MealCardProps[] }) => (
  <div className="hidden md:flex flex-row gap-3 min-h-0 flex-1">
    {meals.map((meal) => (
      <MealCard key={meal.title} {...meal} />
    ))}
  </div>
));
MealCardsDesktop.displayName = 'MealCardsDesktop';

const MealDisplay = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);

  // react-query 기반 훅
  const { data: menu, error, isLoading } = useMealMenu();
  const { preloadDate } = usePreloadMealMenu();

  const [mounted, setMounted] = useState(false);

  // 초기 마운트 시점
  useEffect(() => {
    setMounted(true);

    // 현재 시간에 따라 dateOffset이 있다면 날짜 수정
    const { dateOffset } = getDefaultMealAndDate();
    if (dateOffset > 0) {
      setSelectedDate(getNewDate(selectedDate, dateOffset));
    }
  }, []);

  // 양옆 날짜 미리 불러오기
  useEffect(() => {
    const preloadAdjacentDays = async () => {
      const days = [-1, 1, 2];
      await Promise.all(
        days.map(day => preloadDate(getNewDate(selectedDate, day)))
      );
    };
    preloadAdjacentDays();
  }, [selectedDate, preloadDate]);

  // 날짜 이동 핸들러
  const handleDateChange = (days: number) => {
    setSelectedDate(getNewDate(selectedDate, days));
  };

  // 아직 마운트가 안됐거나 쿼리가 로딩이면 Skeleton
  if (!mounted || isLoading) {
    return (
      <Layout date={selectedDate} handleDateChange={handleDateChange} initialLoading={!mounted}>
        <LoadingSkeleton />
      </Layout>
    );
  }

  // API 에러거나, 데이터가 없다면 빈 메뉴
  const meals: MealCardProps[] = error || !menu
    ? DEFAULT_EMPTY_MEALS
    : [
      {
        title: '조식',
        content: menu.breakfast || '',
        icon: Coffee,
        isEmpty: !menu.breakfast,
        imageUrl: menu.images?.breakfast
      },
      {
        title: '중식',
        content: menu.lunch || '',
        icon: Utensils,
        isEmpty: !menu.lunch,
        imageUrl: menu.images?.lunch
      },
      {
        title: '석식',
        content: menu.dinner || '',
        icon: Moon,
        isEmpty: !menu.dinner,
        imageUrl: menu.images?.dinner
      }
    ];

  return (
    <Layout date={selectedDate} handleDateChange={handleDateChange}>
      <div className="h-full flex flex-col min-h-0">
        {/* 데스크톱 UI */}
        <MealCardsDesktop meals={meals} />

        {/* 모바일 UI */}
        <div className="md:hidden flex-1 min-h-0">
          <MobileMealDisplay meals={meals} />
        </div>
      </div>
    </Layout>
  );
};

export default memo(MealDisplay);
