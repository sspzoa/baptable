import type { MealMenu, MenuPost } from '@/types';

const BASE_URL = 'https://www.dimigo.hs.kr/index.php';
const CAFETERIA_PATH = 'school_cafeteria';

export async function getLatestMenuDocumentIds(pageUrl = `${BASE_URL}?mid=${CAFETERIA_PATH}`): Promise<MenuPost[]> {
  const response = await fetch(pageUrl);
  const html = await response.text();

  const linkPattern = /href="[^"]*document_srl=(\d+)"[^>]*>([^<]+)/g;
  const datePattern = /<td[^>]*>(\d{4}\.\d{2}\.\d{2})<\/td>/g;

  const matches: MenuPost[] = [];
  const dates = [...html.matchAll(datePattern)].map(match => match[1]);
  let dateIndex = 0;

  for (const match of html.matchAll(linkPattern)) {
    const [_, documentId, title] = match;
    if (title.includes('식단')) {
      matches.push({
        documentId,
        title: title.trim(),
        date: dates[dateIndex] || '',
      });
    }
    dateIndex++;
  }

  return matches;
}

export async function getMealMenu(documentId: string): Promise<MealMenu> {
  const response = await fetch(`${BASE_URL}?mid=${CAFETERIA_PATH}&document_srl=${documentId}`);
  const html = await response.text();

  // xe_content 클래스를 가진 div의 내용 추출
  const contentMatch = html.match(/<div[^>]*class="[^"]*xe_content[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  const content = contentMatch ? contentMatch[1] : '';

  const lines = content
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const getMeal = (prefix: string) => {
    const meal = lines.find(line => line.startsWith(`*${prefix}:`));
    return meal ? meal.replace(`*${prefix}:`, '').trim() : '';
  };

  return {
    breakfast: getMeal('조식'),
    lunch: getMeal('중식'),
    dinner: getMeal('석식'),
  };
}

export const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;