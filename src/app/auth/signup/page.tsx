import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">ایجاد حساب کاربری</CardTitle>
            <CardDescription>
              برای ساخت حساب جدید، اطلاعات خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">نام</Label>
                <Input id="first-name" placeholder="علی" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">نام خانوادگی</Label>
                <Input id="last-name" placeholder="رضایی" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                ایجاد حساب
              </Button>
              <Button variant="outline" className="w-full">
                ثبت‌نام با حساب گوگل
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link href="/login" className="underline">
                وارد شوید
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Section */}
      <div className="hidden bg-muted lg:block">
        <Image
          src="/logo.png" // Your logo file
          alt="Brand Logo"
          width="1920"
          height="1080"
          className="h-full w-full object-contain p-12"
        />
      </div>
    </div>
  );
}