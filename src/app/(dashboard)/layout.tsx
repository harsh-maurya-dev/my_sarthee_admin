import { SidebarProvider } from "@/context/sidebar-context";
import { Sidebar } from "./_components/sidebar/sidebar";
import { MobileSidebar } from "./_components/sidebar/mobile-sidebar";
import { Topbar } from "./_components/topbar/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sheet Drawer Sidebar */}
        <MobileSidebar />

        {/* Main Application Container */}
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-4 md:px-6 md:py-4 lg:px-8 lg:pt-0 lg:pb-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
