// src/utils/meal.ts

/**
 * (프론트엔드 전용) /api/meal?date=...를 호출해 메뉴를 가져오기
 *    - useMealMenu 훅에서 불러다 씀
 */
export async function fetchMealMenu(dateString: string) {
  try {
    const res = await fetch(`https://api.xn--rh3b.net/${dateString}`);
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
