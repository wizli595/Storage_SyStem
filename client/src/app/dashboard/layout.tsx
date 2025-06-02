// layout.tsx
import { SidebarProvider } from "@/context/SidebarProvider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
// import toast
// from "react-hot-toast";
import { Toaster } from "react-hot-toast";

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
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                className: "bg-gray-800 text-white",
                duration: 5000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
