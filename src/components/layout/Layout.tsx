import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-2 focus:border focus:border-gray-300">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-grow container mx-auto px-4 py-6">
        {children || <Outlet />}
        <Navigation />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
