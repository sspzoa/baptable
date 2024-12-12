import { selectedDateAtom } from '@/store/atoms';
import type { MealMenu } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

const MEAL_MENU_QUERY_KEY = 'mealMenu' as const;
const STALE_TIME = 1000 * 60 * 5;

const EMPTY_MENU: MealMenu = {
  breakfast: '',
  lunch: '',
  dinner: ''
};

async function fetchMealMenu(date: string): Promise<MealMenu> {
  try {
    const response = await fetch(`/api/meal?date=${date}`);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return EMPTY_MENU;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export function useMealMenu() {
  const [selectedDate] = useAtom(selectedDateAtom);

  return useQuery({
    queryKey: [MEAL_MENU_QUERY_KEY, selectedDate],
    queryFn: () => fetchMealMenu(selectedDate),
    staleTime: STALE_TIME,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}

export function usePreloadMealMenu() {
  const queryClient = useQueryClient();

  return {
    preloadDate: async (date: string) => {
      try {
        await queryClient.prefetchQuery({
          queryKey: [MEAL_MENU_QUERY_KEY, date],
          queryFn: () => fetchMealMenu(date),
          staleTime: STALE_TIME,
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          queryClient.setQueryData([MEAL_MENU_QUERY_KEY, date], EMPTY_MENU);
        } else {
          console.error('Failed to preload meal menu:', error);
        }
      }
    }
  };
}