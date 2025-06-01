"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface OrderTrendData {
  date: Date; // 🔥 use real Date object
  orders: number;
}

interface OrdersTrendLineChartProps {
  ordersData: OrderTrendData[];
}

export default function OrdersTrendLineChart({
  ordersData,
}: OrdersTrendLineChartProps) {
  const [filter, setFilter] = useState<"today" | "7d" | "30d">("7d");

  const filteredData = filterOrders(ordersData, filter);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Orders Trend</h2>
        <div className="flex gap-2">
          {["today", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setFilter(range as "today" | "7d" | "30d")}
              className={`px-3 py-1 rounded-full text-sm border ${
                filter === range
                  ? "bg-indigo-500 text-white"
                  : "border-gray-300 dark:border-gray-700"
              }`}>
              {range === "today"
                ? "Today"
                : range === "7d"
                ? "Last 7 Days"
                : "Last 30 Days"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 🛠️ Filter orders by selected range
function filterOrders(data: OrderTrendData[], filter: "today" | "7d" | "30d") {
  const today = new Date();
  let days = 7;
  if (filter === "today") days = 1;
  else if (filter === "30d") days = 30;

  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - (days - 1));

  return data.filter((item) => item.date >= cutoffDate);
}
