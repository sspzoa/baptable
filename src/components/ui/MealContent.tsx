import {MealCardProps} from '@/types';
import {memo, useState} from 'react';
import {MealHeader} from './MealHeader';
import {MenuItem} from "@/components/ui/MenuItem";
import {Image as ImageIcon} from 'lucide-react';

interface MealContentProps {
  meal: MealCardProps;
}

export const MealContent = memo(({meal}: MealContentProps) => {
  const [showRealImage, setShowRealImage] = useState(false);

  const menuItems = meal.content
    .split('/')
    .filter(item => item.trim())
    .filter(item => !item.includes('2종1택'));

  return (
    <div className="relative flex flex-col h-full">
      <MealHeader icon={meal.icon} title={meal.title}/>
      {meal.isEmpty ? (
        <div className="relative flex items-center justify-center flex-1 text-white/50">
          급식 정보가 없습니다
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[calc(100%-4rem)] overflow-y-auto overflow-x-hidden">
          {meal.imageUrl && (
            <div className="relative w-full rounded-xl">
              <button
                onClick={() => setShowRealImage(!showRealImage)}
                className="ease-in-out duration-300 relative w-full overflow-hidden backdrop-blur-xl bg-white/20 hover:bg-white/50 rounded-2xl border border-white/30 group"
              >
                <div className={`w-full relative transition-all duration-300 ${
                  showRealImage ? '' : 'h-16'
                }`}>
                  <img
                    src={meal.imageUrl}
                    alt={`${meal.title} 메뉴 이미지`}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      showRealImage ? 'blur-0 opacity-100' : 'blur-md opacity-50'
                    }`}
                  />
                  {!showRealImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white"/>
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}
          <ul className='relative flex flex-col space-y-2'>
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