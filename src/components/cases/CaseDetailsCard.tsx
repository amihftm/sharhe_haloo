import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface CaseDetailsCardProps {
  caseId: string;
}

/**
 * A Server Component to fetch and display the static details of a clinical case.
 * This will be displayed alongside the interactive elements of the simulation.
 */
export async function CaseDetailsCard({ caseId }: CaseDetailsCardProps) {
  // Fetch the specific case from the database using the ID from the URL.
  const clinicalCase = await db.case.findUnique({
    where: { id: caseId },
    select: {
      title: true,
      description: true,
    },
  });

  // If no case is found for the given ID, render a 404 page.
  if (!clinicalCase) {
    notFound();
  }

  return (
    <Card className="h-full lg:block hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          شرح اولیه کیس
        </CardTitle>
        <CardDescription>{clinicalCase.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-relaxed text-muted-foreground">
          {clinicalCase.description}
        </p>
      </CardContent>
    </Card>
  );
}
