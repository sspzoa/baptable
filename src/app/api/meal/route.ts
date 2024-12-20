import { formatDate, getLatestMenuDocumentIds, getMealMenu, getMealImages } from '@/utils/meal';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class MenuCache {
  private static instance: MenuCache;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24;
  private readonly TODAY_CACHE_DURATION = 1000 * 60 * 5;

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

    if (this.getKSTTimestamp() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    const timestamp = this.getKSTTimestamp();
    const cacheDuration = this.isTodayDate(key)
      ? this.TODAY_CACHE_DURATION
      : this.CACHE_DURATION;

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt: timestamp + cacheDuration
    });
  }

  private getKSTTimestamp(): number {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return utc + (9 * 60 * 60 * 1000);
  }

  private isTodayDate(dateString: string): boolean {
    const today = formatDate(this.getKSTDate());
    return dateString === today;
  }

  private getKSTDate(): Date {
    const now = new Date();
    return new Date(now.getTime() + (9 * 60 * 60 * 1000 + now.getTimezoneOffset() * 60 * 1000));
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

    const currentYear = getKSTDate().getFullYear();
    const postDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    return formatDate(postDate) === formatDate(new Date(dateParam));
  });
}

function getKSTDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 * 60 * 1000 + now.getTimezoneOffset() * 60 * 1000));
}

function createErrorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}