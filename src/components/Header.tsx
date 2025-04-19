import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                Section 8 RE
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/properties" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary text-sm font-medium">
                Properties
              </Link>
              <Link href="/favorites" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary text-sm font-medium">
                Favorites
              </Link>
              <Link href="/chat" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary text-sm font-medium">
                Community
              </Link>
              <Link href="/coaching" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary text-sm font-medium">
                Coaching
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/login" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Sign in
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/properties" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-primary text-base font-medium">
              Properties
            </Link>
            <Link href="/favorites" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-primary text-base font-medium">
              Favorites
            </Link>
            <Link href="/chat" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-primary text-base font-medium">
              Community
            </Link>
            <Link href="/coaching" className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 hover:border-primary text-base font-medium">
              Coaching
            </Link>
            <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-primary">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}