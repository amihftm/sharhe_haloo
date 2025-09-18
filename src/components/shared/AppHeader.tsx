import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';
import HeaderDropDown from './HeaderDropDown';



export async function AppHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Nav and Desktop Brand/Nav */}
        <div className="flex items-center gap-x-6">
          {/* Mobile Navigation (Hamburger Menu) - visible only on small screens */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Desktop Brand and Navigation - hidden on small screens */}
          <div className="hidden md:flex items-center gap-x-6">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-lg">شرح حال</span>
            </Link>
            <nav className="flex items-center gap-x-6 text-sm">
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                داشبورد
              </Link>
              <Link
                href="/dashboard/student/clinics"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                کلینیک‌ها
              </Link>
              <Link
                href="/about"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                درباره ما
              </Link>
            </nav>
          </div>
        </div>

        {/* Right Side: Theme Toggle and Auth Button */}
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          <ThemeToggle />
          {user ? (
            <HeaderDropDown />
          ) : (
            <Button asChild size="sm">
              <Link href="/api/auth/signin">ورود / ثبت‌نام</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
