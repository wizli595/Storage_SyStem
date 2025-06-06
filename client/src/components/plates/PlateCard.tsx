"use client";

import { motion } from "framer-motion";

interface PlateCardProps {
  plate: { id: string; name: string; price: number };
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

export default function PlateCard({ plate, onEdit, onDelete,deleting }: PlateCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">{plate.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Price: ${plate.price.toFixed(2)}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </motion.div>
  );
}
