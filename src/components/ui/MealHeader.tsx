import { LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface MealHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const MealHeader = memo(({ icon: Icon, title }: MealHeaderProps) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="p-2 bg-orange-500/10 rounded-xl">
      <Icon className="w-5 h-5 text-orange-600" />
    </div>
    <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
      {title}
    </h2>
  </div>
));

MealHeader.displayName = 'MealHeader';