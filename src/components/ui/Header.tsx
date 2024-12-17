import Link from 'next/link';
import { memo, ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export const Header = memo(({ children }: HeaderProps) => (
  <div className="flex items-center justify-center md:justify-between w-full">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
      밥{' '}
      <span className="text-base text-gray-600 font-normal">
        by{' '}
        <Link
          className="relative group inline-block"
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="ease-in-out duration-300 hover:text-orange-500">sspzoa</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 group-hover:w-full transition-all duration-300" />
        </Link>
      </span>
    </h1>
    {children}
  </div>
));

Header.displayName = 'Header';