// src/utils/date.ts
import { addDays } from 'date-fns';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayIndex = date.getDay();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[weekdayIndex];

  // "2023년 3월 23일 (목)" 형태
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 날짜 이동
export function getNewDate(date: Date, dayOffset: number): Date {
  return addDays(date, dayOffset);
}

// 초기 디폴트
export function getDefaultMealAndDate() {
  const now = new Date();
  const hour = now.getHours();

  let index = 0;       // 0: 조식, 1: 중식, 2: 석식
  let dateOffset = 0;  // 현재 날짜 보정

  if (hour >= 8 && hour < 14) {
    index = 1;
  } else if (hour >= 14) {
    index = 2;
  } else {
    index = 0;
  }

  // 오후 8시(20시) 이후면 다음날로 설정
  if (hour >= 20) {
    dateOffset = 1;
    index = 0;  // 다음날 조식으로 설정
  }

  return { index, dateOffset };
}