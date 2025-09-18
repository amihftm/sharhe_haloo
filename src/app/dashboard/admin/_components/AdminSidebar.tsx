'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Users, Settings, Bot } from 'lucide-react';
import { SignOutButton } from '@/components/features/auth/SignOutButton';

// Define the navigation links for the admin panel
const adminNavItems = [
  { href: '/dashboard/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/dashboard/admin/cases', label: 'مدیریت کیس‌ها', icon: FileText },
  { href: '/dashboard/admin/users', label: 'مدیریت کاربران', icon: Users },
  { href: '/dashboard/admin/prompts', label: 'مدیریت پرامپت‌ها', icon: Bot },
  { href: '/dashboard/admin/settings', label: 'تنظیمات', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-muted/40 border-l h-screen flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold text-primary">پنل مدیریت</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
              {
                'bg-primary/10 text-primary font-semibold': pathname === item.href,
              }
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      {/* Sign Out Button added at the bottom of the sidebar */}
      <div className="mt-auto p-4 border-t">
        <SignOutButton />
      </div>
    </aside>
  );
}
