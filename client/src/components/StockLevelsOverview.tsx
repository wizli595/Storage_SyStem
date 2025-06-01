"use client";

import { motion } from "framer-motion";

interface Item {
  name: string;
  stock: number;
  minStock: number;
}

export default function StockLevelsOverview({ items }: { items: Item[] }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">Stock Levels Overview</h2>
      <div className="flex flex-col gap-5 max-h-80 overflow-y-auto pr-2">
        {items.slice(0, 10).map((item, index) => {
          const stockRatio = item.minStock > 0 ? item.stock / item.minStock : 0;
          const percentage =
            item.minStock > 0 ? Math.min(100, stockRatio * 100) : 0;

          let barColor = "bg-green-500";
          if (stockRatio < 0.5) barColor = "bg-red-500";
          else if (stockRatio < 1) barColor = "bg-yellow-500";

          const isLowStock = stockRatio < 1;

          return (
            <div
              key={index}
              className="flex flex-col gap-1 bg-white dark:bg-gray-900 p-4 rounded-lg shadow transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {item.stock.toFixed(1)}
                  </span>
                  {isLowStock && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200">
                      Low
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-2 ${barColor} rounded-full`}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Min: {item.minStock.toFixed(1)}</span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
