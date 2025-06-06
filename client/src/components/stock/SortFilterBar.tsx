"use client";

interface SortFilterBarProps {
  sortField: "price" | "stock";
  sortOrder: "asc" | "desc";
  lowStockOnly: boolean;
  setSortField: (value: "price" | "stock") => void;
  setSortOrder: (value: "asc" | "desc") => void;
  setLowStockOnly: (value: boolean) => void;
}

export default function SortFilterBar({
  sortField,
  sortOrder,
  lowStockOnly,
  setSortField,
  setSortOrder,
  setLowStockOnly,
}: SortFilterBarProps) {
  return (
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
    </div>
  );
}
