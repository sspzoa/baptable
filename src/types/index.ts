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

export interface LoadingSkeletonProps {
  widths?: string[];
  isMobile?: boolean;
}

export interface DateNavigationProps {
  date: string;
  handleDateChange: (days: number) => void;
}

export interface LayoutProps {
  children: React.ReactNode;
  date: string;
  handleDateChange: (days: number) => void;
}