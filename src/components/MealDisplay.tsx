'use client';

import { useMealMenu } from '@/hooks/useMealMenu';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useState } from 'react';

const MealCard = ({ title, content }: { title: string; content: string }) => {
  const menuItems = content.split('/').filter((item) => item.trim());

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex-1">
      <h2 className="text-xl font-semibold pb-2">{title}</h2>
      <ul className="flex flex-col">
        {menuItems.map((item, index) => (
          <li key={index} className="text-gray-600 py-1">
            • {item.trim()}
          </li>
        ))}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse flex-1 flex-col space-y-2">
        <div className="h-[28px] w-24 bg-gray-200 rounded pb-2" />
        <div className="h-[300px] w-full bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const Header = () => (
  <div className="flex flex-col items-start">
    <h1 className="text-2xl font-bold text-center pb-4">
      밥{' '}
      <span className="text-lg text-gray-400">
        by{' '}
        <Link
          className="ease-in-out duration-300 hover:opacity-50"
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noreferrer noopener">
          sspzoa
        </Link>
      </span>
    </h1>
    <div className="flex justify-center">
      <code className="bg-amber-50 px-4 py-2 rounded-md text-sm font-mono">
        https://밥.net/api/meal?date=yyyy-MM-dd
      </code>
    </div>
  </div>
);

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const getNewDate = (currentDate: string, days: number) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const Layout = ({
  children,
  date,
  handleDateChange,
}: {
  children: React.ReactNode;
  date: string;
  handleDateChange: (days: number) => void;
}) => {
  const DateNavigation = () => (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={() => handleDateChange(-1)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="이전 날짜">
        <FontAwesomeIcon icon={faChevronLeft} className="text-xl text-gray-600" />
      </button>
      <span className="text-lg font-medium px-4">{formatDate(date)}</span>
      <button
        type="button"
        onClick={() => handleDateChange(1)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="다음 날짜">
        <FontAwesomeIcon icon={faChevronRight} className="text-xl text-gray-600" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col max-w-5xl mx-auto gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:pb-12">
        <Header />
        <DateNavigation />
      </div>
      {children}
    </div>
  );
};

export default function MealDisplay() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const { data: menu, error, isLoading } = useMealMenu(date);

  const handleDateChange = (days: number) => {
    setDate(getNewDate(date, days));
  };

  if (isLoading) {
    return (
      <Layout date={date} handleDateChange={handleDateChange}>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout date={date} handleDateChange={handleDateChange}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </Layout>
    );
  }

  if (!menu) return null;

  const meals = [
    { title: '조식', content: menu.breakfast },
    { title: '중식', content: menu.lunch },
    { title: '석식', content: menu.dinner },
  ];

  return (
    <Layout date={date} handleDateChange={handleDateChange}>
      <div className="flex flex-col md:flex-row gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.title} {...meal} />
        ))}
      </div>
    </Layout>
  );
}
