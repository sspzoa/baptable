import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

interface MenuItemProps {
  item: string;
  hasImage?: boolean;
}

export const MenuItem = memo(({ item, hasImage }: MenuItemProps) => (
  <li className={`flex items-center group/item text-gray-700 py-1 pl-4 relative ${!hasImage && 'hover:translate-x-2'} transition-all duration-300`}>
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-400 to-orange-500" />
    <Link
      href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(item.trim())}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-lg font-bold hover:text-red-600 transition-colors duration-300"
    >
      {item.trim()}
      <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
    </Link>
  </li>
));

MenuItem.displayName = 'MenuItem';