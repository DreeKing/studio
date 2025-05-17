import type { ReactNode } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { SidebarInset, SidebarRail } from '@/components/ui/sidebar'; // Assuming SidebarRail and SidebarInset are part of your ui/sidebar

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <SidebarRail /> {/* Optional: if you want the draggable rail */}
      <SidebarInset> {/* This should be your main content area that adjusts to the sidebar */}
        <div className="flex-1 flex flex-col">
          {/* Optional Header can go here */}
          {/* <header className="bg-card border-b p-4">
            <h1 className="text-xl font-semibold">Page Title</h1>
          </header> */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarInset>
    </div>
  );
}
