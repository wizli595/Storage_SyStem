"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchItems, fetchOrders, fetchLowStockItems } from "@/lib/api";
import DashboardCard from "@/components/DashboardCard";
import StockLevelsOverview from "@/components/StockLevelsOverview";
import StockHealthPieChart from "@/components/StockHealthPieChart";
import OrdersTrendLineChart from "@/components/OrdersTrendLineChart";
import { BarChart3, ShoppingCart, AlertTriangle } from "lucide-react";
import SkeletonCard from "./SkeletonCard";
import SkeletonChart from "./SkeletonChart";

type Props = {
  userId: string;
};

export default function ClientDashboard({ userId }: Props) {
  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  const { data: lowStockItems = [], isLoading: loadingLowStock } = useQuery({
    queryKey: ["low-stock-items"],
    queryFn: fetchLowStockItems,
  });

  const healthyStockCount = items.length - lowStockItems.length;
  const ordersPerDay = groupOrdersByDay(orders);
  if (loadingItems || loadingOrders || loadingLowStock) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonChart />
        <SkeletonChart />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
      }}
      className="flex flex-col gap-8">
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className="text-3xl font-bold mb-6 text-center sm:text-left">
        📊 Welcome back, User {userId}
      </motion.h1>

      {/* Cards */}
      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Items"
          value={items.length.toString()}
          Icon={BarChart3}
          description="Inventory in system"
        />
        <DashboardCard
          title="Orders Today"
          value={orders.length.toString()}
          Icon={ShoppingCart}
          description="+12% from yesterday"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={lowStockItems.length.toString()}
          Icon={AlertTriangle}
          description="Need immediate attention"
        />
      </motion.div>

      {/* Stock Levels */}
      <StockLevelsOverview items={items} />

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <StockHealthPieChart
          healthyCount={healthyStockCount}
          lowStockCount={lowStockItems.length}
        />
        <OrdersTrendLineChart ordersData={ordersPerDay} />
      </section>
    </motion.div>
  );
}
function groupOrdersByDay(orders: { quantity: number; createdAt: string }[]) {
  const grouped: { [date: string]: number } = {};

  orders.forEach((order) => {
    const dateStr = new Date(order.createdAt).toISOString().slice(0, 10); // 'YYYY-MM-DD'
    if (!grouped[dateStr]) {
      grouped[dateStr] = 0;
    }
    grouped[dateStr] += order.quantity;
  });

  return Object.entries(grouped).map(([date, orders]) => ({
    date: new Date(date),
    orders,
  }));
}
