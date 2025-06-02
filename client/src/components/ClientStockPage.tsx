"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItems, fetchIngredients } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import { FaDownload, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Types
type Item = {
  id: string;
  name: string;
  unit: "KG" | "PLATE" | "LITRE" | "PIECE";
  price: number;
  stock: number;
  minStock: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type Ingredient = {
  id: string;
  itemId: string;
  plateId: string;
  quantity: number;
  plate: {
    id: string;
    name: string;
  };
};

export default function StockPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sortField, setSortField] = useState<"price" | "stock">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const { data: items = [], isLoading: loadingItems } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
    refetchInterval: 30000,
  });

  const { data: ingredients = [], isLoading: loadingIngredients } = useQuery<
    Ingredient[]
  >({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
  });

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    if (lowStockOnly) {
      filtered = filtered.filter((item) => item.stock < item.minStock);
    }
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    return filtered;
  }, [items, search, sortField, sortOrder, lowStockOnly]);

  const lowStockItems = filteredItems.filter(
    (item) => item.stock < item.minStock
  );

  const itemIngredientsMap = useMemo(() => {
    const map: { [key: string]: Ingredient[] } = {};
    for (const ingredient of ingredients) {
      if (!map[ingredient.itemId]) {
        map[ingredient.itemId] = [];
      }
      map[ingredient.itemId].push(ingredient);
    }
    return map;
  }, [ingredients]);

  const handleExportCSV = () => {
    const csvHeader = ["Name", "Unit", "Price", "Stock", "Min Stock"];
    const csvRows = filteredItems.map((item) => [
      item.name,
      item.unit,
      item.price,
      item.stock,
      item.minStock,
    ]);
    const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);
    const totalStock = filteredItems.reduce((sum, item) => sum + item.stock, 0);
    csvRows.push([
      "TOTAL",
      "",
      totalPrice.toFixed(2),
      totalStock.toFixed(1),
      "",
    ]);

    const csvContent = [csvHeader, ...csvRows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "inventory.csv");

    toast.success("CSV Exported Successfully!");
  };

  useEffect(() => {
    localStorage.setItem(
      "stockPageFilters",
      JSON.stringify({ search, sortField, sortOrder, lowStockOnly })
    );
  }, [search, sortField, sortOrder, lowStockOnly]);

  useEffect(() => {
    const saved = localStorage.getItem("stockPageFilters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSearch(parsed.search);
      setSortField(parsed.sortField);
      setSortOrder(parsed.sortOrder);
      setLowStockOnly(parsed.lowStockOnly);
    }
  }, []);

  return (
    <div className="p-8">
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
          ⚠️ {lowStockItems.length} items are below minimum stock. Check them
          now!
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center sm:text-left">
        📦 Stock Management
      </motion.h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow focus:ring focus:border-indigo-500 transition-all"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "price" | "stock")}
            className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="accent-indigo-500"
            />
            Low Stock Only
          </label>

          <button
            onClick={handleExportCSV}
            aria-label="Export inventory to CSV"
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition">
            <FaDownload />
            Export CSV
          </button>

          <button
            onClick={() => setShowNewItemModal(true)}
            aria-label="Add new item"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">
            <FaPlus />
            New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingItems || loadingIngredients
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : filteredItems.map((item) => (
              <StockCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <DetailsModal
            item={selectedItem}
            ingredients={itemIngredientsMap[selectedItem.id] || []}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNewItemModal && (
          <NewItemModal onClose={() => setShowNewItemModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StockCard({ item, onClick }: { item: Item; onClick: () => void }) {
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
      whileHover={{ scale: 1.02, translateY: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {item.unit}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        ${item.price.toFixed(2)}
      </div>

      {/* Circular Progressbar */}
      <div className="w-24 mx-auto">
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

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>Stock: {item.stock}</span>
        <span>Min: {item.minStock}</span>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col gap-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
    </div>
  );
}

function DetailsModal({
  item,
  ingredients,
  onClose,
}: {
  item: Item;
  ingredients: Ingredient[];
  onClose: () => void;
}) {
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
          ✕
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

function NewItemModal({ onClose }: { onClose: () => void }) {
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
          ✕
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
