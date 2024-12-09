import type { MealMenu } from '@/types';
import { useEffect, useState } from 'react';

interface UseMealMenuReturn {
  data: MealMenu | null;
  error: string | null;
  isLoading: boolean;
}

export function useMealMenu(date: string): UseMealMenuReturn {
  const [data, setData] = useState<MealMenu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousDate, setPreviousDate] = useState(date);

  useEffect(() => {
    let isMounted = true;

    const fetchMenu = async () => {
      if (previousDate !== date) {
        setIsLoading(true);
        setPreviousDate(date);
      }

      try {
        const response = await fetch(`/api/meal?date=${date}`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const menuData = await response.json();

        if (isMounted) {
          setData(menuData);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load menu');
          setData(null);
          setIsLoading(false);
        }
      }
    };

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, [date, previousDate]);

  return { data, error, isLoading };
}
