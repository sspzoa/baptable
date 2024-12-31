import { formatDate, getLatestMenuDocumentIds, getMealMenu, getMealImages } from '@/utils/meal';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class MenuCache {
  private static instance: MenuCache;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24; // 하루
  private readonly TODAY_CACHE_DURATION = 1000 * 60 * 5; // 5분

  private constructor() {
    this.cache = new Map();
  }

  // 싱글턴 인스턴스
  static getInstance(): MenuCache {
    if (!MenuCache.instance) {
      MenuCache.instance = new MenuCache();
    }
    return MenuCache.instance;
  }

  // 캐시에서 key 에 해당하는 데이터 가져오기
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // 유효 기간 만료 시 제거
    if (MenuCache.getKSTTimestamp() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // 캐시에 key/data 저장
  set(key: string, data: any): void {
    const timestamp = MenuCache.getKSTTimestamp();
    const cacheDuration = this.isTodayDate(key)
      ? this.TODAY_CACHE_DURATION
      : this.CACHE_DURATION;

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt: timestamp + cacheDuration
    });
  }

  // 캐시 전체 비우기
  clear(): void {
    this.cache.clear();
  }

  // 오늘 날짜인지 확인
  private isTodayDate(dateString: string): boolean {
    // dateString이 "yyyy-MM-dd" 형태라면, 아래와 같이 체크 가능
    const today = formatDate(MenuCache.getKSTDate());
    return dateString === today;
  }

  // KST 기준 타임스탬프
  static getKSTTimestamp(): number {
    return this.getKSTDate().getTime();
  }

  // KST Date 객체 반환
  static getKSTDate(): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 9 * 60 * 60 * 1000);
  }
}

// 싱글턴 캐시 인스턴스
const menuCache = MenuCache.getInstance();

// 라우트 핸들러
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');

    // dateParam 유효성 검사
    if (!dateParam || !isValidDate(dateParam)) {
      return createErrorResponse('Invalid or missing date parameter', 400);
    }

    // 캐시 조회
    const cachedMenu = menuCache.get(dateParam);
    if (cachedMenu) {
      return Response.json(cachedMenu);
    }

    // DB 등에서 문서 ID 목록 가져오기
    const menuPosts = await getLatestMenuDocumentIds();
    // 날짜에 해당하는 post 찾기
    const targetPost = findTargetPost(menuPosts, dateParam);

    if (!targetPost) {
      return createErrorResponse('Menu not found for the specified date', 404);
    }

    // 실제 메뉴 / 이미지 조회
    const mealMenu = await getMealMenu(targetPost.documentId);
    const images = await getMealImages(targetPost.documentId);

    // 응답 객체 생성
    const response = {
      ...mealMenu,
      images
    };

    // 캐시에 저장
    menuCache.set(dateParam, response);

    return Response.json(response);

  } catch (error) {
    console.error('Error fetching meal menu:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// --------------------------------------------------
// 아래는 라우트에서 사용하는 헬퍼 함수들
// --------------------------------------------------

// 날짜 스트링이 실제 유효한 Date인지
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// menuPosts 배열에서 dateParam에 해당하는 post 찾기
function findTargetPost(menuPosts: Array<any>, dateParam: string): any {
  return menuPosts.find(post => {
    const match = post.title.match(/(\d+)월\s*(\d+)일/);
    if (!match) return false;

    const [_, month, day] = match; // ex) month="3", day="15"
    const currentYear = MenuCache.getKSTDate().getFullYear();
    const postDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));

    return formatDate(postDate) === formatDate(new Date(dateParam));
  });
}

// JSON 에러 응답
function createErrorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}
