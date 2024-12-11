import React, { useState } from 'react';
import { Coffee, Moon, Utensils, ExternalLink, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { getDefaultMealAndDate } from '@/utils/date';
import { MealCardProps } from '@/types';

interface IconMap {
  [key: string]: LucideIcon;
}

interface MealDisplayProps {
  meals: Array<MealCardProps>;
}

const MobileMealDisplay: React.FC<MealDisplayProps> = ({ meals }) => {
  const { index: defaultIndex } = getDefaultMealAndDate();
  const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (): void => {
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

  const icons: IconMap = {
    '조식': Coffee,
    '중식': Utensils,
    '석식': Moon
  };

  return (
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 border border-white/50">
      <div
        className="relative h-[calc(100%-3rem)]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="absolute w-full h-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {meals.map((meal, index) => {
            const Icon = icons[meal.title];
            return (
              <div
                key={index}
                className="absolute w-full h-full transition-opacity duration-300"
                style={{
                  left: `${index * 100}%`,
                  opacity: currentIndex === index ? 1 : 0
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {meal.title}
                  </h2>
                </div>
                {meal.isEmpty ? (
                  <div className="flex items-center justify-center h-[calc(100%-4rem)] text-gray-500 text-lg">
                    급식 정보가 없습니다
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {meal.content.split('/').filter((item: string) => item.trim()).map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center group/item text-gray-700 py-1.5 pl-4 relative hover:translate-x-2 transition-all duration-300"
                      >
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                        <Link
                          href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(item.trim())}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-base hover:text-orange-600 transition-colors duration-300"
                        >
                          {item.trim()}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {meals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-orange-600 w-4" : "bg-orange-300"
            }`}
            aria-label={`${index + 1}번째 메뉴로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileMealDisplay;