"use client";

import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Item {
  id: string;
  name: string;
  unit: "KG" | "PLATE" | "LITRE" | "PIECE";
  price: number;
  stock: number;
  minStock: number;
}

interface StockCardProps {
  item: Item;
  onClick: () => void;
}

export default function StockCard({ item, onClick }: StockCardProps) {
  const stockRatio =
    item.minStock > 0 ? (item.stock / item.minStock) * 100 : 100;

  const getStatusColor = () => {
    if (item.stock <= 0) return "#ef4444"; // Red
    if (item.stock < item.minStock) return "#facc15"; // Yellow
    return "#22c55e"; // Green
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, translateY: -8 }}
      className="cursor-pointer bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {item.unit}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        ${item.price.toFixed(2)}
      </div>
      <div className="w-20 mx-auto">
        <CircularProgressbar
          value={Math.min(stockRatio, 100)}
          text={`${Math.round(stockRatio)}%`}
          styles={buildStyles({
            pathColor: getStatusColor(),
            textColor: getStatusColor(),
            trailColor: "#d6d6d6",
          })}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
        <span>Stock: {item.stock}</span>
        <span>Min: {item.minStock}</span>
      </div>
    </motion.div>
  );
}
