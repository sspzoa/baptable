// src/components/Meal/MealCard.tsx
import { memo } from 'react';
import { MealCardProps } from '@/types';
import { MealContent } from './MealContent';

export const MealCard = memo((props: MealCardProps) => {
  return (
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-white/20 rounded-2xl p-6 flex-1 border border-white/30">
      <MealContent meal={props} />
    </div>
  );
});

MealCard.displayName = 'MealCard';

export default MealCard;
