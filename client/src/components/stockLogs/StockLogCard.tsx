"use client";

import type { StockLog } from "@/server/stockLogs/stockLogSchemas";

type Props = {
  log: StockLog;
};

export default function StockLogCard({ log }: Props) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Item ID: <span className="font-semibold">{log.itemId}</span>
      </p>
      <p className="text-lg font-bold mt-2">Quantity: {log.quantity}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Action By: {log.actionBy}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A"}
      </p>
    </div>
  );
}
