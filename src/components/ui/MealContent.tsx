import { MealCardProps } from '@/types';
import { memo } from 'react';
import { MealHeader } from './MealHeader';
import { MenuItem } from "@/components/ui/MenuItem";

interface MealContentProps {
  meal: MealCardProps;
}

export const MealContent = memo(({ meal }: MealContentProps) => {
  const menuItems = meal.content.split('/').filter(item => item.trim());

  return (
    <div className="relative flex flex-col h-full">
      <MealHeader icon={meal.icon} title={meal.title} />
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
          <ul className={`relative flex ${meal.imageUrl ? 'flex-row flex-wrap gap-2' : 'flex-col space-y-2'}`}>
            {menuItems.map((item, idx) => (
              <MenuItem
                key={`${item}-${idx}`}
                item={item}
                hasImage={!!meal.imageUrl}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

MealContent.displayName = 'MealContent';