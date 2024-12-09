import type { MealMenu, MenuPost } from '@/types';
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.dimigo.hs.kr/index.php';
const CAFETERIA_PATH = 'school_cafeteria';

export async function getLatestMenuDocumentIds(pageUrl = `${BASE_URL}?mid=${CAFETERIA_PATH}`): Promise<MenuPost[]> {
  const { data } = await axios.get(pageUrl);
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
        date: $(element).closest('tr').find('td:nth-child(6)').text().trim(),
      };
    })
    .get()
    .filter(Boolean) as MenuPost[];
}

export async function getMealMenu(documentId: string): Promise<MealMenu> {
  const { data } = await axios.get(`${BASE_URL}?mid=${CAFETERIA_PATH}&document_srl=${documentId}`);
  const $ = cheerio.load(data);

  const content = $('.xe_content')
    .text()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const getMeal = (prefix: string) =>
    content
      .find((line) => line.startsWith(`*${prefix}:`))
      ?.replace(`*${prefix}:`, '')
      .trim() || '';

  return {
    breakfast: getMeal('조식'),
    lunch: getMeal('중식'),
    dinner: getMeal('석식'),
    date: documentId,
  };
}

export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
