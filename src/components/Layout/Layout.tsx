// src/components/Layout/Layout.tsx
import { memo, ReactNode, useEffect, useState } from 'react';
import { DateNavigation } from './DateNavigation';
import { LayoutProps } from '@/types';

interface ExtendedLayoutProps extends LayoutProps {
  initialLoading?: boolean;
  children: ReactNode;
}

const BACKGROUNDS = {
  breakfast: '/images/breakfast.svg',
  lunch: '/images/lunch.svg',
  dinner: '/images/dinner.svg'
} as const;

const getTimeBasedBackground = (date: Date): string => {
  const hour = date.getHours();

  if (hour >= 8 && hour < 14) {
    return BACKGROUNDS.lunch;
  } else if (hour >= 14 && hour < 20) {
    return BACKGROUNDS.dinner;
  } else {
    return BACKGROUNDS.breakfast;
  }
};

export const Layout = memo(
  ({ children, date, handleDateChange, initialLoading }: ExtendedLayoutProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // PC일 때만 시간 기반 배경 설정
    useEffect(() => {
      if (!isMobile) {
        const backgroundElement = document.querySelector<HTMLDivElement>('.background-image');
        if (backgroundElement) {
          backgroundElement.style.backgroundImage = `url(${getTimeBasedBackground(new Date())})`;
        }
      }
    }, [isMobile, date]);

    return (
      <div className="relative min-h-[100dvh]">
        <div
          className="background-image fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="relative py-8 px-4">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-3 h-[calc(100dvh-4rem)] min-h-0">
            <DateNavigation
              date={date}
              handleDateChange={handleDateChange}
              isLoading={initialLoading}
            />
            <div className="flex-1 overflow-hidden min-h-0">{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Layout.displayName = 'Layout';