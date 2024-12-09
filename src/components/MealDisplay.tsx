'use client';

import { useMealMenu } from '@/hooks/useMealMenu';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MealCard = ({ title, content }: { title: string; content: string }) => {
  const menuItems = content.split('/').filter((item) => item.trim());

  return (
    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-8 flex-1 border border-white/20 shadow-md transition-all duration-300 group">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent pb-4">
        {title}
      </h2>
      <ul className="flex flex-col space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="text-gray-600 py-1 pl-4 relative group-hover:translate-x-2 transition-transform duration-300">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            {item.trim()}
          </li>
        ))}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="backdrop-blur-xl bg-white/30 rounded-2xl p-8 flex-1 border border-white/20">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 w-32 bg-gradient-to-r from-indigo-300/40 to-purple-300/40 rounded-lg" />
          <div className="space-y-3">
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="h-4 rounded w-full bg-gradient-to-r from-purple-300/30 via-indigo-300/30 to-purple-300/30"
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
    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
      밥{' '}
      <span className="text-xl text-gray-400 font-normal">
        by{' '}
        <Link
          className="ease-in-out duration-300 hover:text-purple-400"
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noreferrer noopener">
          sspzoa
        </Link>
      </span>
    </h1>
    <div className="hidden md:block backdrop-blur-md bg-white/30 px-6 py-3 rounded-xl border border-white/20">
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
    <div className="w-full md:w-[400px] backdrop-blur-md bg-white/30 rounded-2xl px-6 py-3 flex items-center justify-center border border-white/20">
      <button
        type="button"
        onClick={() => handleDateChange(-1)}
        className="p-2 rounded-xl hover:bg-white/30 transition-all duration-300"
        aria-label="이전 날짜">
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      <span className="md:text-xl font-medium px-6 text-gray-700">{formatDate(date)}</span>
      <button
        type="button"
        onClick={() => handleDateChange(1)}
        className="p-2 rounded-xl hover:bg-white/30 transition-all duration-300"
        aria-label="다음 날짜">
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col max-w-6xl mx-auto gap-8 p-8">
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
        <div className="backdrop-blur-md bg-red-100/50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
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
      <div className="flex flex-col md:flex-row gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.title} {...meal} />
        ))}
      </div>
    </Layout>
  );
}
