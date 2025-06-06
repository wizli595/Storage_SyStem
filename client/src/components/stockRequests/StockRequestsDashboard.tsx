
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockRequests } from "@/server/stockRequests/stockRequestApi";
import { AnimatePresence, motion } from "framer-motion";
import StockRequestModal from "@/components/stockRequests/StockRequestModal";
import NewStockRequestModal from "@/components/stockRequests/NewStockRequestModal";
import KpiCard from "@/components/stockRequests/KpiCard";
import { FaPlus } from "react-icons/fa";

export default function StockRequestsDashboard() {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [showNewModal, setShowNewModal] = useState(false);

  const {
    data: stockRequests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stockRequests"],
    queryFn: fetchStockRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const totalRequests = stockRequests.length;
  const approvedRequests = stockRequests.filter(
    (r) => r.status === "APPROVED"
  ).length;
  const issuedRequests = stockRequests.filter(
    (r) => r.status === "ISSUED"
  ).length;

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          📝 Stock Requests
        </h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">
          <FaPlus /> New Request
        </button>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <KpiCard title="Total Requests" value={totalRequests} />
        <KpiCard title="Approved Requests" value={approvedRequests} />
        <KpiCard title="Issued Requests" value={issuedRequests} />
      </div>

      {/* REQUESTS LIST */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Failed to load stock requests.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stockRequests.map((request) => (
            <motion.div
              key={request.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedRequestId(request.id)}>
              <h2 className="text-lg font-semibold mb-2">
                Requester: {request.requester}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                Status: {request.status.toLowerCase()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {selectedRequestId && (
          <StockRequestModal
            requestId={selectedRequestId}
            onClose={() => setSelectedRequestId(null)}
          />
        )}
        {showNewModal && (
          <NewStockRequestModal onClose={() => setShowNewModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
