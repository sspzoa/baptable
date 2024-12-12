const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const KOREA_TIMEZONE = 'Asia/Seoul';

type MealTime = {
  index: number;
  dateOffset: number;
};

export const formatDate = (date: string): string => {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const [year, month, day] = date.split('-');
    const weekday = KOREAN_WEEKDAYS[dateObj.getUTCDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

export const getNewDate = (currentDate: string, days: number): string => {
  try {
    const date = new Date(currentDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    date.setDate(date.getDate() + days);
    return formatDateToISO(date);
  } catch (error) {
    console.error('Error calculating new date:', error);
    return formatDateToISO(new Date());
  }
};

export const getDefaultMealAndDate = (): MealTime => {
  const hour = new Date().getHours();

  if (hour >= 20) return { index: 0, dateOffset: 1 };
  if (hour >= 14) return { index: 2, dateOffset: 0 };
  if (hour >= 8) return { index: 1, dateOffset: 0 };
  return { index: 0, dateOffset: 0 };
};

export const getCurrentDate = (): string => {
  try {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: KOREA_TIMEZONE })
    );
    return formatDateToISO(now);
  } catch (error) {
    console.error('Error getting current date:', error);
    return formatDateToISO(new Date());
  }
};

function formatDateToISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}