import { selectedDateAtom } from '@/store/atoms';
import type { MealMenu } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

const fetchMealMenu = async (date: string): Promise<MealMenu> => {
  const response = await fetch(`/api/meal?date=${date}`);
  if (!response.ok) {
    throw new Error('Failed to fetch menu');
  }
  return response.json();
};

export const MEAL_MENU_QUERY_KEY = 'mealMenu';

export function useMealMenu() {
  const [selectedDate] = useAtom(selectedDateAtom);

  return useQuery({
    queryKey: [MEAL_MENU_QUERY_KEY, selectedDate],
    queryFn: () => fetchMealMenu(selectedDate),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });
}

export function usePreloadMealMenu() {
  const queryClient = useQueryClient();

  const preloadDate = async (date: string) => {
    await queryClient.prefetchQuery({
      queryKey: [MEAL_MENU_QUERY_KEY, date],
      queryFn: () => fetchMealMenu(date),
      staleTime: 1000 * 60 * 5,
    });
  };

  return { preloadDate };
}
