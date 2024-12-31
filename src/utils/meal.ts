// src/utils/meal.ts

import type { MealMenu, MenuPost, MealImages } from '@/types';
import axios from 'axios';
import * as cheerio from 'cheerio';

const CONFIG = {
  BASE_URL: 'https://www.dimigo.hs.kr/index.php',
  CAFETERIA_PATH: 'school_cafeteria',
  MEAL_TYPES: {
    BREAKFAST: '조식',
    LUNCH: '중식',
    DINNER: '석식'
  },
  TIMEOUT: 5000
} as const;

const axiosInstance = axios.create({
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
});

/**
 * 1) 최신 식단 문서 목록 가져오기
 */
export async function getLatestMenuDocumentIds(
  pageUrl = `${CONFIG.BASE_URL}?mid=${CONFIG.CAFETERIA_PATH}`
): Promise<MenuPost[]> {
  try {
    const { data } = await axiosInstance.get(pageUrl);
    const $ = cheerio.load(data);

    // 웹 페이지에서 문서 목록을 추출
    return $('.scContent .scEllipsis a')
      .map((_, element) => {
        const link = $(element).attr('href');
        const documentId = link?.match(/document_srl=(\d+)/)?.[1];
        if (!documentId) return null;

        const title = $(element).text().trim();
        if (!title.includes('식단')) return null;

        return {
          documentId,
          title,
          date: $(element).closest('tr').find('td:nth-child(6)').text().trim()
        };
      })
      .get()
      .filter((post): post is MenuPost => post !== null);
  } catch (error) {
    console.error('Error fetching menu documents:', error);
    throw new Error('Failed to fetch menu documents');
  }
}

/**
 * 2) 특정 documentId에 대응하는 메뉴 이미지들을 가져오기
 */
export async function getMealImages(documentId: string): Promise<MealImages> {
  try {
    const { data } = await axiosInstance.get(
      `${CONFIG.BASE_URL}?mid=${CONFIG.CAFETERIA_PATH}&document_srl=${documentId}`
    );
    const $ = cheerio.load(data);

    const images: MealImages = {
      breakfast: '',
      lunch: '',
      dinner: ''
    };

    // 이미지 URL을 파싱하여 조식/중식/석식에 매핑
    $('.xe_content img').each((_, element) => {
      const imgSrc = $(element).attr('src');
      const imgAlt = $(element).attr('alt')?.toLowerCase() || '';

      if (imgSrc) {
        if (imgAlt.includes('조')) {
          images.breakfast = new URL(imgSrc, 'https://www.dimigo.hs.kr').toString();
        } else if (imgAlt.includes('중')) {
          images.lunch = new URL(imgSrc, 'https://www.dimigo.hs.kr').toString();
        } else if (imgAlt.includes('석')) {
          images.dinner = new URL(imgSrc, 'https://www.dimigo.hs.kr').toString();
        }
      }
    });

    return images;
  } catch (error) {
    console.error('Error fetching meal images:', error);
    throw new Error('Failed to fetch meal images');
  }
}

/**
 * 3) 특정 documentId에 대응하는 급식 메뉴 정보 가져오기
 */
export async function getMealMenu(documentId: string): Promise<MealMenu> {
  try {
    const { data } = await axiosInstance.get(
      `${CONFIG.BASE_URL}?mid=${CONFIG.CAFETERIA_PATH}&document_srl=${documentId}`
    );
    const $ = cheerio.load(data);

    // 전체 텍스트를 줄 단위로 분리
    const content = $('.xe_content')
      .text()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    // 특정 식단(조/중/석)에 해당하는 라인 찾는 헬퍼
    const getMeal = (prefix: string): string => {
      const mealLine = content.find(line => line.startsWith(`*${prefix}:`));
      return mealLine ? mealLine.replace(`*${prefix}:`, '').trim() : '';
    };

    return {
      breakfast: getMeal(CONFIG.MEAL_TYPES.BREAKFAST),
      lunch: getMeal(CONFIG.MEAL_TYPES.LUNCH),
      dinner: getMeal(CONFIG.MEAL_TYPES.DINNER)
    };
  } catch (error) {
    console.error('Error fetching meal menu:', error);
    throw new Error('Failed to fetch meal menu');
  }
}

/**
 * 4) 날짜 객체를 "YYYY-MM-DD" 형태로 포맷팅
 */
export const formatDate = (date: Date): string => {
  try {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * 5) (프론트엔드 전용) /api/meal?date=...를 호출해 메뉴를 가져오기
 *    - useMealMenu 훅에서 불러다 씀
 */
export async function fetchMealMenu(dateString: string) {
  try {
    const res = await fetch(`https://xn--rh3b.net/api/meal?date=${dateString}`);
    if (!res.ok) {
      throw new Error('Failed to fetch meal menu');
    }
    // 서버에서 반환된 JSON (조식/중식/석식 + images)
    return res.json();
  } catch (err) {
    // console.error('Error in fetchMealMenu:', err);
    throw err;
  }
}
