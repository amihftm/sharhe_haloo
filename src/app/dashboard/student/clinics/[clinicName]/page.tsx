import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { Specialities } from '@/data/specialties';

// This is now a Server Component, which is more performant.
export default async function SpecialtyCaseListPage({ params }: { params: Promise<{ clinicName: string }> }) {
  const {clinicName} = await params;
  const casesData = await db.case.findMany({
    where: { specialty: clinicName },
    select: {
      id: true,
      title: true,
      keywords: true,
      riveFileUrl: true,
      description: true,
    },
  });
  const specialty = Specialities.find((s) => s.slug === clinicName)

  // Handle cases where the specialty doesn't exist
  if (!casesData.length || !specialty) {
    return (
      <div>
        <h1 className="text-2xl font-bold">محتوا یافت نشد</h1>
        <p className="text-muted-foreground">
          متاسفانه موردی برای این تخصص یافت نشد.
        </p>
        <Button asChild variant="link" className="pr-0 mt-4">
          <Link href="/dashboard/student/clinics">
            <ArrowLeft className="ms-2 h-4 w-4" />
            بازگشت به کتابخانه کیس‌ها
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          کیس‌های تخصص: <span className="text-primary">{specialty.name}</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          یک سناریوی بالینی را برای شروع فرآیند یادگیری و تشخیص انتخاب کنید.
        </p>
      </div>

      {/* Case List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {casesData.map((caseItem) => (
          <Card key={caseItem.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{caseItem.title}</CardTitle>
              <CardDescription>{caseItem.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <h4 className="font-semibold mb-2">اهداف یادگیری:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {caseItem.keywords.map((obj) => (
                  <li key={obj}>{obj}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                {/* This link would go to the actual case simulation page */}
                <Link href={`/dashboard/student/cases/${caseItem.id}`}>
                  شروع کیس
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
