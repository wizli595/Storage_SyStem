"use client";

import { useState } from "react";
import { StockRequestItem } from "@/server/stockRequestItems/stockRequestItemSchemas";

export default function StockRequestItemRow({
  item,
  onApprove,
  onIssue,
}: {
  item: StockRequestItem;
  onApprove: (quantity: number) => void;
  onIssue: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState<number>(1);

  const handleApprove = () => {
    if (quantity > 0) {
      onApprove(quantity);
    }
  };

  const handleIssue = () => {
    if (quantity > 0) {
      onIssue(quantity);
    }
  };

  const status = itemStatus(item);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <td className="px-6 py-4 flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
        {item.item.name}
        <StatusBadge status={status} />
      </td>
      <td className="px-6 py-4">{item.requestedQuantity}</td>
      <td className="px-6 py-4">{item.approvedQuantity ?? "-"}</td>
      <td className="px-6 py-4">{item.issuedQuantity ?? "-"}</td>
      <td className="px-6 py-4">
        {status === "PENDING" && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 p-1 border border-gray-300 dark:border-gray-700 rounded text-center dark:bg-gray-900 dark:text-white"
            />
            <button
              onClick={handleApprove}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow">
              Approve
            </button>
            <button
              onClick={handleIssue}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm shadow">
              Issue
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// Status calculation
function itemStatus(item: StockRequestItem) {
  if (item.issuedQuantity && item.issuedQuantity > 0) return "ISSUED";
  if (item.approvedQuantity && item.approvedQuantity > 0) return "APPROVED";
  return "PENDING";
}

// Status badge
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-400",
    APPROVED: "bg-blue-400",
    ISSUED: "bg-green-400",
  };

  return (
    <span
      className={`text-xs font-bold ${colorMap[status]} text-white rounded-full px-2 py-0.5`}>
      {status}
    </span>
  );
}
