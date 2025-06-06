"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPlates, deletePlate } from "@/server/plates/platesApi";
import { AnimatePresence, motion } from "framer-motion";
import PlateCard from "@/components/plates/PlateCard";
import PlateModal from "@/components/plates/PlateModel";
import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function ClientPlatesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editPlate, setEditPlate] = useState<null | {
    id: string;
    name: string;
    price: number;
  }>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: plates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plates"],
    queryFn: fetchPlates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePlate,
    onSuccess: () => {
      toast.success("Plate deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["plates"] });
    },
    onError: () => {
      toast.error("Failed to delete plate");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this plate?")) {
      setDeletingId(id);
      deleteMutation.mutate(id, {
        onSettled: () => {
          setDeletingId(null);
        },
      });
    }
  };

  const filteredPlates = useMemo(() => {
    return plates.filter((plate) =>
      plate.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [plates, search]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredPlates.length / ITEMS_PER_PAGE);

  const paginatedPlates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredPlates.slice(start, end);
  }, [filteredPlates, currentPage]);

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          🍽️ Plates Management
        </h1>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search plates..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition w-64"
            />
          </div>
          {/* New Plate Button */}
          <button
            onClick={() => {
              setEditPlate(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">
            <FaPlus /> New Plate
          </button>
        </div>
      </motion.div>

      {/* CONTENT */}
      {isLoading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : isError ? (
        // Error State
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">
            Failed to load plates. Please try again later.
          </p>
        </div>
      ) : paginatedPlates.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPlates.map((plate) => (
              <PlateCard
                key={plate.id}
                plate={plate}
                onEdit={() => {
                  setEditPlate(plate);
                  setShowModal(true);
                }}
                onDelete={() => handleDelete(plate.id)}
                deleting={deletingId === plate.id} // <- Pass deleting status
              />
            ))}
          </motion.div>

          {/* PAGINATION CONTROLS */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50">
              <FaChevronLeft />
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50">
              <FaChevronRight />
            </button>
          </div>
        </>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center mt-12">
          {/* You can add a custom SVG here */}

          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
            No plates found. Try creating one!
          </p>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <PlateModal
            onClose={() => setShowModal(false)}
            initialData={editPlate || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
