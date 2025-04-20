'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Simple error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Caught error:', event.error);
      setHasError(true);
      // Prevent the error from bubbling up
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Something went wrong</h2>
        <p className="text-red-500 dark:text-red-300">This component could not be loaded. This would be working in the production version.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prevent crashes from propagating up
  const renderSafely = (component: React.ReactNode) => (
    <ErrorBoundary>{component}</ErrorBoundary>
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen transition duration-300 dark:bg-dark-bg dark:text-dark-text">
          {renderSafely(<Header />)}
          <main className="flex-grow">
            {renderSafely(children)}
          </main>
          {renderSafely(<Footer />)}
          
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toaster-bg, #fff)',
                color: 'var(--toaster-color, #333)',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '16px',
              },
              className: '!bg-white dark:!bg-dark-card dark:!text-dark-text',
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Demo badge - only for the demo version */}
          <div className="fixed bottom-4 left-4 bg-section8-gradient dark:bg-section8-dark-gradient text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-section8 animate-pulse-slow">
            Demo Version
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}