"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import SearchBar from "@/components/stock/SearchBar";
import SortFilterBar from "@/components/stock/SortFilterBar";
import StockCard from "@/components/stock/StockCard";
import SkeletonCard from "@/components/stock/SkeletonCard";
import LowStockAlert from "@/components/stock/LowStockAlert";
import ExportButton from "@/components/stock/ExportButton";
import NewItemButton from "@/components/stock/NewItemButton";
import DetailsModal from "@/components/stock/DetailsModal";
import NewItemModal from "@/components/stock/NewItemModal";
import { fetchItems } from "@/server/items/itemsApi";
import { fetchIngredients } from "@/server/ingredients/ingredientsApi";

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

export default function ClientStockPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sortField, setSortField] = useState<"price" | "stock">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const { data: items = [], isLoading: loadingItems } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
    refetchInterval: 30000, // Auto refresh every 30 seconds
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: ingredients = [], isLoading: loadingIngredients } = useQuery<
    Ingredient[]
  >({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  

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
      <LowStockAlert count={lowStockItems.length} />

      <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">
        📦 Stock Management
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex flex-wrap gap-2 items-center">
          <SortFilterBar
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            lowStockOnly={lowStockOnly}
            setLowStockOnly={setLowStockOnly}
          />
          <ExportButton onExport={handleExportCSV} />
          <NewItemButton onClick={() => setShowNewItemModal(true)} />
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
