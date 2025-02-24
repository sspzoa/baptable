// src/components/common/LoadingSkeleton.tsx
import { memo } from 'react';
import { LoadingSkeletonProps } from '@/types';

const SkeletonItem = memo(({ width }: { width: string }) => (
  <div className="flex items-center py-1 pl-4 relative">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
    <div className={`h-7 rounded-full bg-white/30 ${width}`} />
  </div>
));
SkeletonItem.displayName = 'SkeletonItem';

const SkeletonHeader = memo(() => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-9 h-9 bg-white/30 rounded-xl" />
    <div className="h-7 w-16 bg-white/30 rounded-lg" />
  </div>
));
SkeletonHeader.displayName = 'SkeletonHeader';

const SkeletonCard = memo(({ widths }: { widths: string[] }) => (
  <div className="h-full overflow-hidden backdrop-blur-xl bg-white/20 rounded-2xl p-6 flex-1 border border-white/30">
    <div className="animate-pulse flex flex-col h-full">
      <SkeletonHeader />
      <div className="space-y-0.5 md:space-y-1.5 flex-1">
        {widths.map((width, i) => (
          <SkeletonItem key={i} width={width} />
        ))}
      </div>
    </div>
  </div>
));
SkeletonCard.displayName = 'SkeletonCard';

export const LoadingSkeleton = memo(
  ({ widths = ['w-2/3', 'w-3/4', 'w-4/5', 'w-3/5'] }: LoadingSkeletonProps) => {
    return (
      <div className="h-full flex flex-col gap-3">
        {/* 모바일 뷰 */}
        <div className="md:hidden h-full flex-1">
          <SkeletonCard widths={widths} />
        </div>
        {/* 데스크톱 뷰 */}
        <div className="hidden md:flex flex-row gap-3 flex-1">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} widths={widths} />
          ))}
        </div>
      </div>
    );
  }
);
LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
