'use client';

import { useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/lib/actions/auth.actions';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  className?: string;
}

/**
 * A client component that provides a button to sign out,
 * including a confirmation dialog.
 */
export function SignOutButton({ className }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
            className
          )}
        >
          <LogOut className="h-5 w-5" />
          خروج از حساب کاربری
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>آیا برای خروج مطمئن هستید؟</DialogTitle>
          <DialogDescription>
            شما از حساب کاربری خود خارج خواهید شد. برای دسترسی مجدد به داشبورد،
            نیاز به ورود دوباره دارید.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="secondary">انصراف</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isPending}
          >
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            خروج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
