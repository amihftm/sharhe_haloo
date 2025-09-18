'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { SignOutAction } from '@/actions/auth';
import Link from 'next/link';
import { useCurrentUser } from '@/context/user-context';

/**
 * Helper function to generate initials from a user's name.
 * @param name - The full name of the user.
 * @returns A string with the user's initials.
 */
const getUserInitials = (name: string | null | undefined): string => {
  if (!name) return '...';
  const names = name.trim().split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};


export default function HeaderDropDown() {
    const {user} = useCurrentUser()
    if (!user) return
    return (
      <DropdownMenu dir='rtl'>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
              <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard">
              <LayoutDashboard className="ml-2 h-4 w-4" />
              <span>داشبورد</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings">
              <Settings className="ml-2 h-4 w-4" />
              <span>تنظیمات</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={SignOutAction} className="w-full">
            <button type="submit" className="w-full">
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="ml-2 h-4 w-4" />
                <span>خروج از حساب</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}