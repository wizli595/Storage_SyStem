"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStockLogs } from "@/server/stockLogs/stockLogsApi";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import type { StockLogs } from "@/server/stockLogs/stockLogSchemas";
import ItemStockTrends from "@/components/stockLogs/ItemStockTrends";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ITEMS_PER_PAGE = 10;

export function ClientStockLogsPage() {
  const { data: stockLogs = [], isLoading } = useQuery<StockLogs>({
    queryKey: ["stock-logs"],
    queryFn: fetchStockLogs,
    staleTime: 1000 * 60 * 5,
  });

  const [filterType, setFilterType] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return stockLogs
      .filter((log) => {
        if (filterType !== "ALL" && log.changeType !== filterType) {
          return false;
        }
        if (fromDate && new Date(log.date) < new Date(fromDate)) {
          return false;
        }
        if (toDate && new Date(log.date) > new Date(toDate)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stockLogs, filterType, fromDate, toDate]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const handleExportExcel = () => {
    exportToExcel(filteredLogs, "StockLogs");
  };

  const handleExportPDF = () => {
    exportToPDF(filteredLogs, "Stock Logs Report");
  };

  const barChartData = filteredLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString(),
    quantity: log.quantity,
  }));

  const groupedByItem = useMemo(() => {
    const map: { [key: string]: { date: string; quantity: number }[] } = {};
    stockLogs.forEach((log) => {
      const date = new Date(log.date).toLocaleDateString();
      if (!map[log.itemId]) map[log.itemId] = [];
      map[log.itemId].push({ date, quantity: log.quantity });
    });
    return map;
  }, [stockLogs]);

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-950">
      <h1 className="text-4xl font-bold mb-8">📜 Stock Logs ERP</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <select
          className="p-2 border rounded"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}>
          <option value="ALL">All</option>
          <option value="RECEIVED">Received</option>
          <option value="ISSUED">Issued</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded"
        />

        <button
          onClick={handleExportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition">
          Export to Excel
        </button>

        <button
          onClick={handleExportPDF}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">
          Export to PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-8 rounded-lg shadow-md">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Action By
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Change Type
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition`}>
                  <td className="px-6 py-4">
                    {new Date(log.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{log.itemId}</td>
                  <td className="px-6 py-4">{log.quantity}</td>
                  <td className="px-6 py-4">{log.actionBy}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold leading-5 rounded-full ${
                        log.changeType === "RECEIVED"
                          ? "bg-green-100 text-green-800"
                          : log.changeType === "ISSUED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {log.changeType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 my-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50">
          ⬅️ Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50">
          Next ➡️
        </button>
      </div>

      {/* Bar Chart */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">📈 Stock Quantity Changes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
            />
            <Bar dataKey="quantity" fill="#4F46E5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Line Charts */}
      <ItemStockTrends groupedByItem={groupedByItem} />
    </div>
  );
}
