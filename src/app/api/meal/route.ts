import { formatDate, getLatestMenuDocumentIds, getMealMenu, getMealImages } from '@/utils/meal';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class MenuCache {
  private static instance: MenuCache;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): MenuCache {
    if (!MenuCache.instance) {
      MenuCache.instance = new MenuCache();
    }
    return MenuCache.instance;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt: timestamp + this.CACHE_DURATION
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const menuCache = MenuCache.getInstance();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');

    if (!dateParam || !isValidDate(dateParam)) {
      return createErrorResponse('Invalid or missing date parameter', 400);
    }

    const cachedMenu = menuCache.get(dateParam);
    if (cachedMenu) {
      return Response.json(cachedMenu);
    }

    const menuPosts = await getLatestMenuDocumentIds();
    const targetPost = findTargetPost(menuPosts, dateParam);

    if (!targetPost) {
      return createErrorResponse('Menu not found for the specified date', 404);
    }

    const mealMenu = await getMealMenu(targetPost.documentId);
    const images = await getMealImages(targetPost.documentId);

    const response = {
      ...mealMenu,
      images
    };

    menuCache.set(dateParam, response);

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching meal menu:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function findTargetPost(menuPosts: Array<any>, dateParam: string): any {
  return menuPosts.find(post => {
    const [_, month, day] = post.title.match(/(\d+)월\s*(\d+)일/) || [];
    if (!month || !day) return false;

    const currentYear = new Date().getFullYear();
    const postDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    return formatDate(postDate) === formatDate(new Date(dateParam));
  });
}

function createErrorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}