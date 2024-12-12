import { memo, useState, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getDefaultMealAndDate } from '@/utils/date';
import { MealCardProps } from '@/types';

const MIN_SWIPE_DISTANCE = 50;

const MenuItem = memo(({ item }: { item: string }) => (
  <li className="flex items-center group/item text-gray-700 py-1 pl-3 relative hover:translate-x-2 transition-all duration-300">
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
    <Link
      href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(item.trim())}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-sm hover:text-orange-600 transition-colors duration-300"
    >
      {item.trim()}
      <ExternalLink className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
    </Link>
  </li>
));

MenuItem.displayName = 'MenuItem';

const MealContent = memo(({ meal }: { meal: MealCardProps }) => {
  const menuItems = meal.content.split('/').filter(item => item.trim());
  const Icon = meal.icon;

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-500/10 rounded-xl">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          {meal.title}
        </h2>
      </div>
      {meal.isEmpty ? (
        <div className="relative flex items-center justify-center flex-1 text-gray-500">
          급식 정보가 없습니다
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[calc(100%-4rem)] overflow-y-auto overflow-x-hidden">
          {meal.imageUrl && (
            <div className="relative w-full rounded-xl flex items-center justify-center">
              <img
                draggable={false}
                src={meal.imageUrl}
                alt={`${meal.title} 메뉴 이미지`}
                className="object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
          )}
          <ul className="relative flex flex-col space-y-2">
            {menuItems.map((item, idx) => (
              <MenuItem key={`${item}-${idx}`} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

MealContent.displayName = 'MealContent';

const NavigationDots = memo(({
                               currentIndex,
                               total,
                               onSelect
                             }: {
  currentIndex: number;
  total: number;
  onSelect: (index: number) => void;
}) => (
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
    {Array.from({ length: total }, (_, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          index === currentIndex ? "bg-orange-600 w-4" : "bg-orange-300"
        }`}
        aria-label={`${index + 1}번째 메뉴로 이동`}
      />
    ))}
  </div>
));

NavigationDots.displayName = 'NavigationDots';

interface MealDisplayProps {
  meals: Array<MealCardProps>;
}

const MobileMealDisplay = ({ meals }: MealDisplayProps) => {
  const { index: defaultIndex } = getDefaultMealAndDate();
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 flex-1 border border-white/50">
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