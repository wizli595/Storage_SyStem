// layout.tsx
import { SidebarProvider } from "@/context/SidebarProvider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 pt-24 transition-all duration-300 sm:ml-60">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
