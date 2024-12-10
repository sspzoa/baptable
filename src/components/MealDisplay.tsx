'use client'

import { useMealMenu, usePreloadMealMenu } from '@/hooks/useMealMenu';
import { selectedDateAtom } from '@/store/atoms';
import { MealCardProps } from '@/types';
import { getDefaultMealAndDate, getNewDate } from '@/utils/date';
import { useAtom } from 'jotai';
import { Coffee, Moon, Utensils } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Layout } from './Layout';
import { LoadingSkeleton } from './LoadingSkeleton';
import { MealCard } from './MealCard';
import { MealSwiper } from './MealSwiper';

const MealDisplay: React.FC = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const { data: menu, error, isLoading } = useMealMenu();
  const { preloadDate } = usePreloadMealMenu();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    if (!mounted) {
      const { dateOffset } = getDefaultMealAndDate();
      if (dateOffset > 0) {
        const newDate = getNewDate(selectedDate, dateOffset);
        setSelectedDate(newDate);
      }
    }
  }, [mounted, selectedDate, setSelectedDate]);

  useEffect(() => {
    const nextDay = getNewDate(selectedDate, 1);
    const previousDay = getNewDate(selectedDate, -1);
    preloadDate(nextDay);
    preloadDate(previousDay);
  }, [selectedDate, preloadDate]);

  const handleDateChange = (days: number) => {
    const newDate = getNewDate(selectedDate, days);
    setSelectedDate(newDate);
  };

  if (!mounted || isLoading) {
    return (
      <Layout date={selectedDate} handleDateChange={handleDateChange} initialLoading={!mounted}>
        <LoadingSkeleton />
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
        <div className="h-full flex flex-col">
          <div className="hidden md:flex flex-row gap-3 flex-1">
            {defaultEmptyMeals.map((meal) => (
              <MealCard key={meal.title} {...meal} />
            ))}
          </div>
          <div className="md:hidden flex-1">
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