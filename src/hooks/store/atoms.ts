// src/store/atoms.ts
import { atom } from 'jotai';

// 예: 선택된 날짜를 관리하는 jotai atom
export const selectedDateAtom = atom<Date>(new Date());
