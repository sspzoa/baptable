export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const [year, month, day] = date.split('-');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[dateObj.getUTCDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

export const getNewDate = (currentDate: string, days: number): string => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDefaultMealAndDate = (): { index: number; dateOffset: number } => {
  const hour = new Date().getHours();

  if (hour >= 20) {
    return { index: 0, dateOffset: 1 };
  } else if (hour >= 14) {
    return { index: 2, dateOffset: 0 };
  } else if (hour >= 8) {
    return { index: 1, dateOffset: 0 };
  } else {
    return { index: 0, dateOffset: 0 };
  }
};

export const getCurrentDate = () => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};