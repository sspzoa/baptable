import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { selectedDateAtom } from '@/hooks/store/atoms';
import { fetchMealMenu } from '@/utils/meal';
import { format } from 'date-fns';

export function useMealMenu() {
  const [selectedDate] = useAtom(selectedDateAtom);
  const dateString = format(selectedDate, 'yyyy-MM-dd');

  const query = useQuery({
    queryKey: ['mealMenu', dateString],
    queryFn: async () => {
      try {
        const data = await fetchMealMenu(dateString);
        return data;
      } catch (err) {
        // console.error('[useMealMenu] Failed to fetch meal. Returning empty data:', err);
        return {
          breakfast: '',
          lunch: '',
          dinner: '',
          images: {},
        };
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
}

export function usePreloadMealMenu() {
  const queryClient = useQueryClient();

  async function preloadDate(date: Date) {
    const dateString = format(date, 'yyyy-MM-dd');
    return queryClient.prefetchQuery({
      queryKey: ['mealMenu', dateString],
      queryFn: async () => {
        try {
          return await fetchMealMenu(dateString);
        } catch (err) {
          // console.error('[usePreloadMealMenu] Failed to fetch meal. Returning empty data:', err);
          return {
            breakfast: '',
            lunch: '',
            dinner: '',
            images: {},
          };
        }
      },
    });
  }

  return { preloadDate };
}