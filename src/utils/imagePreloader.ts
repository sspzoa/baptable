// src/utils/imagePreloader.ts

const BACKGROUNDS = {
  breakfast: '/images/breakfast.svg',
  lunch: '/images/lunch.svg',
  dinner: '/images/dinner.svg'
} as const;

// 이미지 미리 로드 함수
export const preloadImages = (): Promise<void[]> => {
  const imageUrls = Object.values(BACKGROUNDS);

  const loadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  };

  return Promise.all(imageUrls.map(loadImage));
};

// 모든 배경 이미지 URL 내보내기
export const backgroundUrls = Object.values(BACKGROUNDS);

// 배경 이미지 상수 내보내기
export { BACKGROUNDS };