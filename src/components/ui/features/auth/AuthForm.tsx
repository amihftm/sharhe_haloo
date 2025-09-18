'use client';

import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/actions/auth.actions';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { Loader2 } from 'lucide-react'; // A great loading spinner from lucide-react

// A new component to handle the button's pending state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="ms-2 h-4 w-4 animate-spin" />
          کمی صبر کنید...
        </>
      ) : (
        <>
          <GoogleIcon className="ms-2 h-4 w-4" />
          ورود با گوگل
        </>
      )}
    </Button>
  );
}

export function AuthForm() {
  return (
    <Card className="w-full max-w-sm border-gray-200/80 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">ورود / ثبت‌نام</CardTitle>
        <CardDescription>
          برای دسترسی به پلتفرم از طریق حساب گوگل خود وارد شوید
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The form now uses the new SubmitButton component */}
        <form action={signInWithGoogle}>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
