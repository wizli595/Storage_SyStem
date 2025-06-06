"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchItems } from "@/server/items/itemsApi"; // assuming you have itemApi
import { createStockRequest } from "@/server/stockRequests/stockRequestApi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function NewStockRequestModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [requester, setRequester] = useState("");
  const [items, setItems] = useState<
    { itemId: string; requestedQuantity: number }[]
  >([{ itemId: "", requestedQuantity: 1 }]);

  const queryClient = useQueryClient();

  // Fetch Items for selection
  const { data: availableItems = [] } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const mutation = useMutation({
    mutationFn: createStockRequest,
    onSuccess: () => {
      toast.success("Stock Request Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["stockRequests"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to Create Stock Request");
    },
  });

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { itemId: "", requestedQuantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !requester.trim() ||
      items.some((item) => !item.itemId || item.requestedQuantity <= 0)
    ) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    mutation.mutate({ requester, items });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">
          ×
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">
          📝 New Stock Request
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Requester Name
          </label>
          <input
            type="text"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder="Enter requester name"
            required
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Items
          </h3>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <select
                value={item.itemId}
                onChange={(e) =>
                  handleItemChange(index, "itemId", e.target.value)
                }
                className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                <option value="">Select Item</option>
                {availableItems.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={item.requestedQuantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "requestedQuantity",
                    Number(e.target.value)
                  )
                }
                className="w-24 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 font-bold text-xl">
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-semibold">
            + Add Another Item
          </button>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all">
          {mutation.isPending ? "Submitting..." : "Create Request"}
        </button>
      </motion.form>
    </motion.div>
  );
}
