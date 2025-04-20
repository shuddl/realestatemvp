'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white shadow-md dark:bg-dark-card dark:border-b dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-section8-dark dark:text-section8-light transition-colors duration-300 flex items-center">
                <span className="bg-section8-gradient dark:bg-section8-dark-gradient text-white rounded-md px-2 py-1 mr-2 shadow-section8">S8</span>
                <span>Investor Hub</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/properties" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-section8 dark:hover:border-section8-light text-sm font-medium">
                Properties
              </Link>
              <Link href="/favorites" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-section8 dark:hover:border-section8-light text-sm font-medium">
                Favorites
              </Link>
              <Link href="/compliance-hub" className="inline-flex items-center px-1 pt-1 border-b-2 border-section8 dark:border-section8-light text-sm font-medium text-section8 dark:text-section8-light">
                Compliance Hub
              </Link>
              <Link href="/chat" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-section8 dark:hover:border-section8-light text-sm font-medium">
                Community
              </Link>
              <Link href="/coaching" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-section8 dark:hover:border-section8-light text-sm font-medium">
                Coaching
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-section8"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <Link href="/login" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-section8 hover:bg-section8-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-section8 transition-colors duration-300 shadow-section8 hover:shadow-section8-hover">
              Sign in
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile theme toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-inset focus:ring-section8"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden dark:bg-dark-card">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/properties" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-dark-border hover:border-section8 dark:hover:border-section8-light text-base font-medium">
              Properties
            </Link>
            <Link href="/favorites" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-dark-border hover:border-section8 dark:hover:border-section8-light text-base font-medium">
              Favorites
            </Link>
            <Link href="/compliance-hub" className="block pl-3 pr-4 py-2 border-l-4 border-section8 dark:border-section8-light bg-primary-50 dark:bg-dark-border text-base font-medium text-section8 dark:text-section8-light">
              Compliance Hub
            </Link>
            <Link href="/chat" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-dark-border hover:border-section8 dark:hover:border-section8-light text-base font-medium">
              Community
            </Link>
            <Link href="/coaching" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-dark-border hover:border-section8 dark:hover:border-section8-light text-base font-medium">
              Coaching
            </Link>
            <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-section8 dark:text-section8-light">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}