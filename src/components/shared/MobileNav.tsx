"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0">
        <Link
          href="/"
          className="flex items-center mb-6"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-bold text-lg">شرح حال</span>
        </Link>
        <div className="flex flex-col gap-y-4 text-lg">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            onClick={() => setIsOpen(false)}
          >
            داشبورد
          </Link>
          <Link
            href="/cases"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            onClick={() => setIsOpen(false)}
          >
            کیس‌های بالینی
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            onClick={() => setIsOpen(false)}
          >
            درباره ما
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
