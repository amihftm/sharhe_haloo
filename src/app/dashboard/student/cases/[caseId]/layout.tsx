import { CaseDetailsCard } from '@/components/cases/CaseDetailsCard';
import { CaseStepProvider } from './_components/CaseStepProvider';
import { CaseStepperNav } from './_components/CaseStepperNav';

interface CaseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ caseId: string }>;
}

/**
 * The main layout for a clinical case simulation.
 * It sets up a responsive two-column grid where the main content area
 * can scroll independently.
 */
export default async function CaseLayout({ children, params }: CaseLayoutProps) {
  const { caseId } = await params;

  return (
    <CaseStepProvider>
      {/* The parent grid takes up the full available height. */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 flex-1 gap-6 p-4 md:p-6 h-full">
        
        {/* Left Column: Becomes sticky on large screens. */}
        <aside className="lg:col-span-1 flex flex-col gap-6 h-fit">
          <div className="lg:sticky lg:top-6 flex flex-col gap-6">
            {/*  Next.js handles async Server Components here correctly. */}
            <CaseDetailsCard caseId={caseId} />
            <div className="lg:mt-4 ">
              <CaseStepperNav />
            </div>
          </div>
        </aside>

        {/* Right Column: This column is now a flex container that establishes a height boundary. */}
        {/* The `min-h-0` is crucial for allowing the child component to control scrolling. */}
        <main className="lg:col-span-2 flex flex-col min-h-0 max-h-96 lg:max-h-full">
          {/* The page component rendered here as {children} is now responsible for its own scrolling. */}
          {children}
        </main>
      </div>
    </CaseStepProvider>
  );
}
