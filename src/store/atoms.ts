import { atom } from 'jotai';
import { getCurrentDate } from '@/utils/date';

export const selectedDateAtom = atom(getCurrentDate());