import type { MealMenu, MenuPost } from '@/types';
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

export async function getLatestMenuDocumentIds(
  pageUrl = `${CONFIG.BASE_URL}?mid=${CONFIG.CAFETERIA_PATH}`
): Promise<MenuPost[]> {
  try {
    const { data } = await axiosInstance.get(pageUrl);
    const $ = cheerio.load(data);

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

export async function getMealMenu(documentId: string): Promise<MealMenu> {
  try {
    const { data } = await axiosInstance.get(
      `${CONFIG.BASE_URL}?mid=${CONFIG.CAFETERIA_PATH}&document_srl=${documentId}`
    );
    const $ = cheerio.load(data);

    const content = $('.xe_content')
      .text()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

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

export const formatDate = (date: Date): string => {
  try {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};