import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-950">
      {showNav && <Navbar />}
      <main className={showNav ? 'pt-16' : ''}>{children}</main>
    </div>
  );
}
