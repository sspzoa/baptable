import { formatDate, getLatestMenuDocumentIds, getMealMenu } from '@/utils/meal';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1시간
const menuCache = new Map<string, CacheEntry>();

function getCachedData(key: string): any | null {
  const entry = menuCache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    menuCache.delete(key);
    return null;
  }

  return entry.data;
}

function setCacheData(key: string, data: any) {
  menuCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export async function GET(request: Request) {
  try {
    const dateParam = new URL(request.url).searchParams.get('date');
    if (!dateParam) {
      return Response.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    // 캐시 확인
    const cachedMenu = getCachedData(dateParam);
    if (cachedMenu) {
      return Response.json(cachedMenu);
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

    // 결과를 캐시에 저장
    setCacheData(dateParam, mealMenu);

    return Response.json(mealMenu);
  } catch (error) {
    console.error('Error fetching meal menu:', error);
    return Response.json({ error: 'Failed to fetch meal menu' }, { status: 500 });
  }
}
