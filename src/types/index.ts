import type { LucideIcon } from 'lucide-react';

export interface MealMenu {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MenuPost {
  documentId: string;
  title: string;
  date: string;
}

export interface MealCardProps {
  title: string;
  content: string;
  icon: LucideIcon;
  isEmpty?: boolean;
}

export interface MealSwiperProps {
  meals: MealCardProps[];
}