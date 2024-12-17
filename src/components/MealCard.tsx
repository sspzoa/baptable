import { MealCardProps } from '@/types';
import { memo } from 'react';
import { MealContent } from '@/components/ui/MealContent';

export const MealCard = memo<MealCardProps>((props) => {
  return (
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 flex-1 border border-white/50">
      <MealContent meal={props} />
    </div>
  );
});

MealCard.displayName = 'MealCard';