import { memo } from 'react';

interface NavigationDotsProps {
  currentIndex: number;
  total: number;
  onSelect: (index: number) => void;
}

export const NavigationDots = memo(({
                                      currentIndex,
                                      total,
                                      onSelect
                                    }: NavigationDotsProps) => (
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