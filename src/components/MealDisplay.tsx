'use client'

import { useMealMenu, usePreloadMealMenu } from '@/hooks/useMealMenu';
import { selectedDateAtom } from '@/store/atoms';
import { MealCardProps } from '@/types';
import { getDefaultMealAndDate, getNewDate } from '@/utils/date';
import { useAtom } from 'jotai';
import { Coffee, Moon, Utensils } from 'lucide-react';
import { useEffect, useState, memo } from 'react';
import { Layout } from './Layout';
import { LoadingSkeleton } from './LoadingSkeleton';
import { MealCard } from './MealCard';
import MobileMealDisplay from './MobileMealDisplay';

const DEFAULT_EMPTY_MEALS: MealCardProps[] = [
  { title: '조식', icon: Coffee, content: "", isEmpty: true },
  { title: '중식', icon: Utensils, content: "", isEmpty: true },
  { title: '석식', icon: Moon, content: "", isEmpty: true }
] as const;

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
  const { data: menu, error, isLoading } = useMealMenu();
  const { preloadDate } = usePreloadMealMenu();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const { dateOffset } = getDefaultMealAndDate();

    if (dateOffset > 0) {
      setSelectedDate(getNewDate(selectedDate, dateOffset));
    }
  }, []);

  useEffect(() => {
    const preloadAdjacentDays = async () => {
      const days = [-2, -1, 1, 2];
      await Promise.all(
        days.map(day => preloadDate(getNewDate(selectedDate, day)))
      );
    };

    preloadAdjacentDays();
  }, [selectedDate, preloadDate]);

  const handleDateChange = (days: number) => {
    setSelectedDate(getNewDate(selectedDate, days));
  };

  if (!mounted || isLoading) {
    return (
      <Layout date={selectedDate} handleDateChange={handleDateChange} initialLoading={!mounted}>
        <LoadingSkeleton />
      </Layout>
    );
  }

  const meals: MealCardProps[] = error || !menu ? DEFAULT_EMPTY_MEALS : [
    { title: '조식', content: menu.breakfast || '', icon: Coffee, isEmpty: !menu.breakfast },
    { title: '중식', content: menu.lunch || '', icon: Utensils, isEmpty: !menu.lunch },
    { title: '석식', content: menu.dinner || '', icon: Moon, isEmpty: !menu.dinner }
  ];

  return (
    <Layout date={selectedDate} handleDateChange={handleDateChange}>
      <div className="h-full flex flex-col min-h-0">
        <MealCardsDesktop meals={meals} />
        <div className="md:hidden flex-1 min-h-0">
          <MobileMealDisplay meals={meals} />
        </div>
      </div>
    </Layout>
  );
};

export default memo(MealDisplay);