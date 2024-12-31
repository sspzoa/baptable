// src/components/Meal/MobileMealDisplay.tsx

"use client"

import { memo, useState, useCallback, useEffect } from 'react';
import { getDefaultMealAndDate } from '@/utils/date';
import { MealCardProps } from '@/types';
import { MealContent } from './MealContent';
import { NavigationDots } from './NavigationDots';

const MIN_SWIPE_DISTANCE = 50;

const BACKGROUNDS = {
  breakfast: '/images/breakfast.svg',
  lunch: '/images/lunch.svg',
  dinner: '/images/dinner.svg'
} as const;

interface MobileMealDisplayProps {
  meals: MealCardProps[];
}

const MobileMealDisplay = ({ meals }: MobileMealDisplayProps) => {
  const { index: defaultIndex } = getDefaultMealAndDate();
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 현재 인덱스에 따른 배경 변경
  useEffect(() => {
    const backgrounds = [
      BACKGROUNDS.breakfast,
      BACKGROUNDS.lunch,
      BACKGROUNDS.dinner
    ];

    // 모바일 여부 체크
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const backgroundElement = document.querySelector<HTMLDivElement>('.background-image');
    if (backgroundElement) {
      backgroundElement.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
    }
  }, [currentIndex]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe && currentIndex < meals.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  }, [touchStart, touchEnd, currentIndex, meals.length]);

  const handleDotSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-white/20 rounded-2xl p-6 flex-1 border border-white/30">
      <div className="relative flex flex-col h-full">
        <div
          className="flex-1 touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-full">
            {meals.map((meal, index) => (
              <div
                key={meal.title}
                className="absolute w-full h-full transition-all duration-300"
                style={{
                  left: `${index * 100}%`,
                  transform: `translateX(-${currentIndex * 100}%)`,
                  opacity: currentIndex === index ? 1 : 0,
                  pointerEvents: currentIndex === index ? 'auto' : 'none',
                }}
              >
                <MealContent meal={meal} />
              </div>
            ))}
          </div>
        </div>
        <NavigationDots
          currentIndex={currentIndex}
          total={meals.length}
          onSelect={handleDotSelect}
        />
      </div>
    </div>
  );
};

export default memo(MobileMealDisplay);