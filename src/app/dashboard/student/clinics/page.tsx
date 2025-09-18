// app/clinics/page.tsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';
import React from 'react';
import { Specialities } from '@/data/specialties';

// --- Reusable Specialty Card Component ---
interface SpecialtyCardProps {
  name: string;
  icon: React.ElementType;
  href: string;
}

function SpecialtyCard({ name, icon: Icon, href }: SpecialtyCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-200 ease-in-out hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Icon size={40} className="mb-4 text-primary" />
          <span className="font-semibold text-card-foreground">{name}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

// --- Main Page Component ---
export default function CaseLibraryPage() {
  return (
    <div className="space-y-12">
      {/* 1. "Start a Case" Card */}
      <Card className="w-full overflow-hidden bg-gradient-to-r from-primary/80 to-primary text-primary-foreground">
        <div className="flex flex-col items-center justify-between p-6 text-center md:flex-row md:text-right">
          <div className="mb-4 md:mb-0">
            <CardTitle className="text-2xl font-extrabold">
              آماده تمرین هستی؟
            </CardTitle>
            <CardDescription className="mt-1 text-lg text-primary-foreground/80">
              یک کیس تصادفی را برای به چالش کشیدن مهارت‌های بالینی خود شروع کنید.
            </CardDescription>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="shrink-0"
            asChild
          >
            {/* This would link to a random case page */}
            <Link href="/clinics/random">
              <Dices className="ms-2 h-5 w-5" />
              شروع کیس تصادفی
            </Link>
          </Button>
        </div>
      </Card>

      {/* 2. Specialty List */}
      <section>
        <h2 className="mb-6 border-r-4 border-primary pr-4 text-3xl font-bold">
          کتابخانه کیس‌ها بر اساس تخصص
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Specialities.map((specialty) => (
            <SpecialtyCard
              key={`clinic-${specialty.slug}-${specialty.code}`}
              name={specialty.name}
              icon={specialty.icon}
              href={`./clinics/${specialty.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
