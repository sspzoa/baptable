'use client';

import { useMealMenu } from '@/hooks/useMealMenu';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MealCard = ({ title, content }: { title: string; content: string }) => {
  const menuItems = content.split('/').filter((item) => item.trim());

  return (
    <div className="backdrop-blur-lg bg-white/40 rounded-3xl p-8 flex-1 border border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/50">
      <h2 className="text-2xl font-bold text-blue-600 pb-4">{title}</h2>
      <ul className="flex flex-col space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="text-gray-700 py-1 pl-4 relative hover:translate-x-2 transition-transform duration-300">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400" />
            <Link
              href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(item.trim())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors duration-300">
              {item.trim()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="backdrop-blur-lg bg-white/40 rounded-3xl p-8 flex-1 border border-white/40 shadow-lg">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 w-32 bg-blue-200/50 rounded-lg" />
          <div className="space-y-3">
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="h-4 rounded w-full bg-blue-100/50"
                style={{
                  animationDelay: `${j * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Header = () => (
  <div className="flex flex-col items-start space-y-4">
    <h1 className="text-4xl font-bold text-blue-600">
      밥{' '}
      <span className="text-xl text-gray-500 font-normal">
        by{' '}
        <Link
          className="ease-in-out duration-300 hover:text-blue-400"
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noreferrer noopener">
          sspzoa
        </Link>
      </span>
    </h1>
    <div className="hidden md:block backdrop-blur-lg bg-white/40 px-6 py-3 rounded-2xl border border-white/40 shadow-md">
      <code className="text-sm font-mono text-gray-600">https://밥.net/api/meal?date=yyyy-MM-dd</code>
    </div>
  </div>
);

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const [year, month, day] = date.split('-');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[dateObj.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
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
    <div className="w-full md:w-[400px] backdrop-blur-lg bg-white/40 rounded-2xl px-6 py-3 flex items-center justify-center border border-white/40 shadow-md">
      <button
        type="button"
        onClick={() => handleDateChange(-1)}
        className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300"
        aria-label="이전 날짜">
        <ChevronLeft className="w-6 h-6 text-blue-600" />
      </button>
      <span className="md:text-xl font-medium px-6 text-gray-700">{formatDate(date)}</span>
      <button
        type="button"
        onClick={() => handleDateChange(1)}
        className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300"
        aria-label="다음 날짜">
        <ChevronRight className="w-6 h-6 text-blue-600" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col max-w-6xl mx-auto gap-4 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:pb-16">
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
        <div className="backdrop-blur-lg bg-white/40 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-md">
          {error}
        </div>
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
      <div className="flex flex-col md:flex-row gap-4">
        {meals.map((meal) => (
          <MealCard key={meal.title} {...meal} />
        ))}
      </div>
    </Layout>
  );
}
