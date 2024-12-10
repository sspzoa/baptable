import { LoadingSkeletonProps } from '@/types';
import React from 'react';

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
                                                                  widths = ['w-2/3', 'w-3/4', 'w-4/5', 'w-3/5']
                                                                }) => {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="md:hidden flex-1 h-full">
        <div className="h-full overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 border border-white/50">
          <div className="animate-pulse flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-blue-200/50 rounded-xl" />
              <div className="h-7 w-16 bg-blue-200/50 rounded-lg" />
            </div>
            <div className="space-y-2 flex-1">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center py-1 pl-3 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-200/50" />
                  <div className={`h-5 rounded-full bg-gradient-to-r from-blue-100/50 to-purple-100/50 ${widths[j]}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-row gap-3 flex-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 flex-1 border border-white/50">
            <div className="animate-pulse flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 bg-blue-200/50 rounded-xl" />
                <div className="h-7 w-16 bg-blue-200/50 rounded-lg" />
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center py-1 pl-3 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-200/50" />
                    <div className={`h-5 rounded-full bg-gradient-to-r from-blue-100/50 to-purple-100/50 ${widths[j]}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};