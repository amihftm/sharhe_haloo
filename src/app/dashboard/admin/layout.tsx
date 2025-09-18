import { AdminSidebar } from './_components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Provides a consistent layout for all pages within the admin dashboard.
 * It includes a sidebar for navigation and a main content area for the page itself.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex bg-background" dir="rtl">
      {/* The sidebar is fixed and takes up the full height */}
      <AdminSidebar />
      
      {/* The main content area takes the remaining space and handles its own scrolling */}
      <main className="flex-1 flex flex-col h-screen">
        <header className="h-16 flex items-center px-6 border-b bg-muted/40">
          {/* You can add a header here with user menu, notifications, etc. */}
          <h2 className="text-lg font-semibold">خوش آمدید!</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
