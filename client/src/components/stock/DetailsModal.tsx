"use client";

import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";

interface Item {
  name: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
}

interface Ingredient {
  plate: { name: string };
  quantity: number;
}

interface DetailsModalProps {
  item: Item;
  ingredients: Ingredient[];
  onClose: () => void;
}

export default function DetailsModal({
  item,
  ingredients,
  onClose,
}: DetailsModalProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <IoIosCloseCircle className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Unit: {item.unit}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Price: ${item.price.toFixed(2)}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Stock: {item.stock}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Min Stock: {item.minStock}
        </p>
        {ingredients.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Used In:</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
              {ingredients.map((ing, index) => (
                <li key={index}>
                  {ing.plate?.name || "Unknown Plate"} — Quantity:{" "}
                  {ing.quantity}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-400">No associated plates.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
