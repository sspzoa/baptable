// src/utils/background.ts
import { useEffect, useState } from 'react';

const BACKGROUNDS = {
  breakfast: '/images/breakfast.webp',
  lunch: '/images/lunch.webp',
  dinner: '/images/dinner.webp'
} as const;

export function getTimeBasedBackground(date: Date): string {
  const hour = date.getHours();

  if (hour >= 4 && hour < 10) {
    return BACKGROUNDS.breakfast;
  } else if (hour >= 10 && hour < 16) {
    return BACKGROUNDS.lunch;
  } else {
    return BACKGROUNDS.dinner;
  }
}

export function getMealTypeBackground(index: number): string {
  switch (index) {
    case 0:
      return BACKGROUNDS.breakfast;
    case 1:
      return BACKGROUNDS.lunch;
    case 2:
      return BACKGROUNDS.dinner;
    default:
      return BACKGROUNDS.breakfast;
  }
}

export function useBackgroundImage(currentIndex: number) {
  const [isMobile, setIsMobile] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // 모바일 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 배경 이미지 설정
    if (isMobile) {
      setBackgroundImage(getMealTypeBackground(currentIndex));
    } else {
      setBackgroundImage(getTimeBasedBackground(new Date()));
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [currentIndex, isMobile]);

  return backgroundImage;
}