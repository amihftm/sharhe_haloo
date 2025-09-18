import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';
import { Providers } from './providers';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppFooter } from '@/components/shared/AppFooter';
import { Toaster } from 'sonner';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'شرح حالو | سامانه آموزش پزشکی مبتنی بر هوش مصنوعی',
  description: 'سامانه آموزش بالینی و گام به گام اصول شرح حال گیری و دید بالینی برای دانشجویان پزشکی.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          vazirmatn.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background">
            <AppHeader />
            <div className='flex flex-1'>
              <div className="container mx-auto px-4 py-8 min-h-full">{children}</div>
              </div>
            <AppFooter />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
