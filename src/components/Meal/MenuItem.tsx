// src/components/Meal/MenuItem.tsx
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

interface MenuItemProps {
  item: string;
}

export const MenuItem = memo(({ item }: MenuItemProps) => (
  <li className="flex items-center group/item text-white py-1 pl-4 relative hover:translate-x-2 transition-all duration-300">
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
    <Link
      href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(
        item
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-lg font-bold hover:text-white/80 transition-colors duration-300"
    >
      {item}
      <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
    </Link>
  </li>
));

MenuItem.displayName = 'MenuItem';

export default MenuItem;
