// src/components/Meal/MealHeader.tsx
import { LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface MealHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const MealHeader = memo(({ icon: Icon, title }: MealHeaderProps) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="p-2 bg-white/20 rounded-xl">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-xl font-bold text-white">{title}</h2>
  </div>
));

MealHeader.displayName = 'MealHeader';

export default MealHeader;
