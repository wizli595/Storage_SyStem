"use client";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
export default async function Dashboard() {
  const session = (await getSession()) as { userId: string };

  if (!session) {
    return <p>Unauthorized. Redirecting...</p>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Header />
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 p-8 pt-24 ml-60">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <Card title="Total Stock" value="12,340" />
          <Card title="Orders Today" value="89" />
          <Card title="Low Stock Alerts" value="4" />
        </div>
      </motion.main>
    </div>
  );
}

type CardProps = {
  title: string;
  value: string;
};

const Card = ({ title, value }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);
