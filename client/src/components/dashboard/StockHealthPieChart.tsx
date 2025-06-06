"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

export default function StockHealthPieChart({
  healthyCount,
  lowStockCount,
}: {
  healthyCount: number;
  lowStockCount: number;
}) {
  const pieData = [
    { name: "Healthy", value: healthyCount },
    { name: "Low Stock", value: lowStockCount },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">Stock Health</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            dataKey="value">
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
