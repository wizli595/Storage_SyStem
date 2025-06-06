"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStockRequestItems,
  approveStockRequestItem,
  issueStockRequestItem,
} from "@/server/stockRequestItems/stockRequestItemApi";
import { motion } from "framer-motion";
import StockRequestItemRow from "./StockRequestItemRow";
import { IoIosCloseCircle } from "react-icons/io";

export default function StockRequestModal({
  requestId,
  onClose,
}: {
  requestId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["stockRequestItems", requestId],
    queryFn: () => fetchStockRequestItems(requestId),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      approveStockRequestItem(id, quantity),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stockRequestItems", requestId],
      }),
  });

  const issueMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      issueStockRequestItem(id, quantity),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stockRequestItems", requestId],
      }),
  });

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-5xl overflow-y-auto max-h-[90vh] relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">
          <IoIosCloseCircle />
        </button>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          📝 Stock Request Details
        </h2>

        {isLoading ? (
          <div className="text-center p-6">Loading items...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse rounded-lg shadow-sm overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 text-left">Item</th>
                  <th className="px-6 py-4 text-left">Requested</th>
                  <th className="px-6 py-4 text-left">Approved</th>
                  <th className="px-6 py-4 text-left">Issued</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <StockRequestItemRow
                    key={item.id}
                    item={item}
                    onApprove={(quantity) =>
                      approveMutation.mutate({ id: item.id, quantity })
                    }
                    onIssue={(quantity) =>
                      issueMutation.mutate({ id: item.id, quantity })
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
