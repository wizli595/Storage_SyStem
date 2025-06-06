"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/server/orders/orderApi";
import { fetchPlates } from "@/server/plates/platesApi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";

export default function NewOrderModal({ onClose }: { onClose: () => void }) {
  const [selectedPlateId, setSelectedPlateId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();

  const { data: plates = [], isLoading: loadingPlates } = useQuery({
    queryKey: ["plates"],
    queryFn: fetchPlates,
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order created successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] as const });
      onClose();
    },
    onError: () => {
      toast.error("Failed to create order.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlateId) {
      toast.error("Please select a plate!");
      return;
    }
    mutation.mutate({ plateId: selectedPlateId, quantity });
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
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <IoIosCloseCircle className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-6">New Order</h2>

        <div className="flex flex-col gap-4">
          {loadingPlates ? (
            <div>Loading plates...</div>
          ) : (
            <select
              value={selectedPlateId}
              onChange={(e) => setSelectedPlateId(e.target.value)}
              required
              className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="">Select a Plate</option>
              {plates.map((plate) => (
                <option key={plate.id} value={plate.id}>
                  {plate.name} — ${plate.price.toFixed(2)}
                  {plate.category ? ` [${plate.category}]` : ""}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            min={1}
            className="p-3 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow">
            Create Order
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
