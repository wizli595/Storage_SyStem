"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlate, updatePlate } from "@/server/plates/platesApi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface PlateModalProps {
  onClose: () => void;
  initialData?: { id: string; name: string; price: number };
}

export default function PlateModal({ onClose, initialData }: PlateModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || 0);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: initialData
      ? (data: { name: string; price: number }) =>
          updatePlate(initialData.id, data)
      : createPlate,
    onSuccess: () => {
      toast.success(
        `Plate ${initialData ? "updated" : "created"} successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["plates"] });
      onClose();
    },
    onError: () => {
      toast.error(`Failed to ${initialData ? "update" : "create"} plate`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, price });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {initialData ? "Edit Plate" : "New Plate"}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter plate name"
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Price
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter price"
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">
          {mutation.isPending
            ? "Submitting..."
            : initialData
            ? "Update"
            : "Create"}
        </button>
      </motion.form>
    </motion.div>
  );
}
