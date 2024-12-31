// src/components/Meal/MealContent.tsx

"use client"

import { memo, useState } from 'react';
import { MealCardProps } from '@/types';
import { MealHeader } from './MealHeader';
import { MenuItem } from './MenuItem';
import { Image as ImageIcon } from 'lucide-react';

interface MealContentProps {
  meal: MealCardProps;
}

export const MealContent = memo(({ meal }: MealContentProps) => {
  const [showRealImage, setShowRealImage] = useState(false);

  const menuItems = meal.content
    .split('/')
    .map(item => item.trim())
    .filter(Boolean)         // 빈 문자열 제외
    .filter(item => !item.includes('우유'))
    .filter(item => !item.includes('시리얼'));

  return (
    <div className="relative flex flex-col h-full">
      <MealHeader icon={meal.icon} title={meal.title} />

      {meal.isEmpty ? (
        <div className="flex items-center justify-center flex-1 text-white/50">
          급식 정보가 없습니다
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[calc(100%-4rem)] overflow-y-auto overflow-x-hidden">
          {/* 이미지 토글 */}
          {meal.imageUrl && (
            <div className="relative w-full rounded-xl">
              <button
                onClick={() => setShowRealImage(prev => !prev)}
                className="ease-in-out duration-300 relative w-full overflow-hidden backdrop-blur-xl bg-white/20 hover:bg-white/50 rounded-2xl border border-white/30 group"
              >
                <div
                  className={`w-full relative transition-all duration-300 ${
                    showRealImage ? '' : 'h-16'
                  }`}
                >
                  <img
                    draggable={false}
                    src={meal.imageUrl}
                    alt={`${meal.title} 메뉴 이미지`}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      showRealImage ? 'blur-0 opacity-100' : 'blur-md opacity-50'
                    }`}
                  />
                  {!showRealImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* 메뉴 목록 */}
          <ul className="flex flex-col space-y-0.5 md:space-y-1.5">
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

export default MealContent;
