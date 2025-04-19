import type { Metadata } from 'next';
import '@/styles/globals.css';
import AppWrapper from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'Real Estate MVP',
  description: 'Section 8 Real Estate Analysis Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}