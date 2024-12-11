import { MealCardProps } from '@/types';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const MealCard: React.FC<MealCardProps> = ({ title, content, icon: Icon, isEmpty }) => {
  const menuItems = content.split('/').filter((item) => item.trim());

  return (
    <div className="relative h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 flex-1 border border-white/50">
      <div className="relative flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        {isEmpty ? (
          <div className="relative flex items-center justify-center flex-1 text-gray-500">급식 정보가 없습니다</div>
        ) : (
          <div className="max-h-[calc(100%-4rem)]">
            <ul className="relative flex flex-col space-y-2">
              {menuItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-center group/item text-gray-700 py-1 pl-3 relative hover:translate-x-2 transition-all duration-300">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                  <Link href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(item.trim())}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:text-orange-600 transition-colors duration-300">
                    {item.trim()}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};