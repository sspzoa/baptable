// src/types/index.ts
import { LucideIcon } from 'lucide-react';

// LayoutProps
export interface LayoutProps {
  date: Date;
  handleDateChange: (days: number) => void;
}

// DateNavigationProps
export interface DateNavigationProps {
  date: Date;
  handleDateChange: (days: number) => void;
}

// MealCardProps
export interface MealCardProps {
  title: string;
  content: string;
  icon: LucideIcon;
  isEmpty?: boolean;
  imageUrl?: string;
}

// LoadingSkeletonProps
export interface LoadingSkeletonProps {
  widths?: string[];
}

// MealImages
export interface MealImages {
  breakfast: string;
  lunch: string;
  dinner: string;
}

// MealMenu
export interface MealMenu {
  breakfast: string;
  lunch: string;
  dinner: string;
  images?: MealImages;
}

// MenuPost
export interface MenuPost {
  documentId: string;
  title: string;
  date: string;
}