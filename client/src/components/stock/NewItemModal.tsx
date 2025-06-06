"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function NewItemModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<"KG" | "PLATE" | "LITRE" | "PIECE">("KG");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, unit, price, stock, minStock });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}>
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <IoIosCloseCircle className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <select
            value={unit}
            onChange={(e) =>
              setUnit(e.target.value as "KG" | "PLATE" | "LITRE" | "PIECE")
            }
            required
            className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="KG">KG</option>
            <option value="PLATE">PLATE</option>
            <option value="LITRE">LITRE</option>
            <option value="PIECE">PIECE</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(parseFloat(e.target.value))}
            required
            className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Min Stock"
            value={minStock}
            onChange={(e) => setMinStock(parseFloat(e.target.value))}
            required
            className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow">
            Add Item
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
