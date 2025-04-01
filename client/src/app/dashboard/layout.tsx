import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex transition-colors duration-300">
      <Header />
      <Sidebar />
      <main className="flex-1 p-8 pt-24 ml-60">{children}</main>
    </div>
  );
}
