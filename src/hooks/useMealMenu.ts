import { selectedDateAtom } from '@/store/atoms';
import type { MealMenu } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { Coffee, UtensilsCrossed, Wine } from 'lucide-react';
import type { MealCardProps } from '@/types';

const MEAL_MENU_QUERY_KEY = 'mealMenu' as const;
const STALE_TIME = 1000 * 60 * 5;

const EMPTY_MENU: MealMenu = {
  breakfast: '',
  lunch: '',
  dinner: '',
  images: {
    breakfast: '',
    lunch: '',
    dinner: ''
  }
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

function convertToMealCards(menu: MealMenu): MealCardProps[] {
  return [
    {
      title: '아침',
      content: menu.breakfast,
      icon: Coffee,
      isEmpty: !menu.breakfast,
      imageUrl: menu.images?.breakfast
    },
    {
      title: '점심',
      content: menu.lunch,
      icon: UtensilsCrossed,
      isEmpty: !menu.lunch,
      imageUrl: menu.images?.lunch
    },
    {
      title: '저녁',
      content: menu.dinner,
      icon: Wine,
      isEmpty: !menu.dinner,
      imageUrl: menu.images?.dinner
    }
  ];
}

export function useMealMenu() {
  const [selectedDate] = useAtom(selectedDateAtom);
  const query = useQuery({
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

  return {
    ...query,
    mealCards: query.data ? convertToMealCards(query.data) : []
  };
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