import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllCases } from '@/lib/actions/case.actions';
import { columns } from './_components/columns';
import { CasesDataTable } from './_components/CasesDataTable';

/**
 * Placeholder page for managing clinical cases.
 * This is where you will add the UI to create, edit, and delete cases.
 */
export default async function AdminCasesPage() {
  const cases = await getAllCases();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت کیس‌های بالینی</h1>
        <Link href={"./cases/create"}>
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            ایجاد کیس جدید
          </Button>
        </Link>
      </div>
      <div>
        <CasesDataTable columns={columns} data={cases} />
      </div>
    </div>
  );
}
