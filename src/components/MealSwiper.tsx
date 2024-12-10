import { MealSwiperProps } from '@/types';
import { getDefaultMealAndDate } from '@/utils/date';
import React, { useState } from 'react';
import { MealCard } from './MealCard';

export const MealSwiper: React.FC<MealSwiperProps> = ({ meals }) => {
  const { index: defaultIndex } = getDefaultMealAndDate();
  const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);
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
      <div className="flex-1 touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="h-full">
          <MealCard {...meals[currentIndex]} />
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {meals.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-blue-600 w-4" : "bg-blue-300"}`} aria-label={`${index + 1}번째 메뉴로 이동`} />
        ))}
      </div>
    </div>
  );
};