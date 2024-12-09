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

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export async function GET(request: Request) {
  try {
    const dateParam = new URL(request.url).searchParams.get('date');
    if (!dateParam) {
      return Response.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const menuPosts = await getLatestMenuDocumentIds();
    const targetPost = menuPosts.find((post) => {
      const [_, month, day] = post.title.match(/(\d+)월\s*(\d+)일/) || [];
      if (!month || !day) return false;

      const currentYear = new Date().getFullYear();
      const postDate = new Date(currentYear, Number.parseInt(month) - 1, Number.parseInt(day));
      return formatDate(postDate) === formatDate(new Date(dateParam));
    });

    if (!targetPost) {
      return Response.json({ error: 'Menu not found for the specified date' }, { status: 404 });
    }

    const mealMenu = await getMealMenu(targetPost.documentId);
    return Response.json(mealMenu);
  } catch (error) {
    console.error('Error fetching meal menu:', error);
    return Response.json({ error: 'Failed to fetch meal menu' }, { status: 500 });
  }
}
