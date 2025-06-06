"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { fetchOrders } from "@/server/orders/orderApi";
import { fetchStockRequests } from "@/server/stockRequests/stockRequestApi";
import { fetchStockLogsByItem } from "@/server/stockLogs/stockLogsApi";
import { StockRequest } from "@/server/stockRequests/stockRequestSchemas";
import { exportDashboardReportToPDF } from "@/utils/exportUtils";

const COLORS = ["#00C49F", "#FF8042"];

export default function VerificationClientPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const { data: stockRequests = [] } = useQuery({
    queryKey: ["stockRequests"],
    queryFn: fetchStockRequests,
  });

  const matchedOrders = orders.filter((order) =>
    stockRequests.some((request) =>
      sameDate(request.createdAt, order.createdAt)
    )
  );

  const unmatchedOrders = orders.filter(
    (order) =>
      !stockRequests.some((request) =>
        sameDate(request.createdAt, order.createdAt)
      )
  );

  const unmatchedRequests = stockRequests.filter(
    (request) =>
      !orders.some((order) => sameDate(request.createdAt, order.createdAt))
  );

  const suspiciousItems = unmatchedRequests.flatMap((req: StockRequest) =>
    Array.isArray(req.StockRequestItem)
      ? req.StockRequestItem.map((item) => ({
          ...item,
          requester: req.requester, // Attach requester for display
        }))
      : []
  );
  function handleExportReport() {
    const reportData = {
      date: new Date().toLocaleDateString(),
      totalOrders: orders.length,
      totalStockRequests: stockRequests.length,
      unmatchedOrders: unmatchedOrders.length,
      unmatchedRequests: unmatchedRequests.length,
      warehouseRiskScore,
      highRiskItems: suspiciousItems
        .filter(
          (item) =>
            getRiskLevel(item.requestedQuantity, item.issuedQuantity).level ===
            "high"
        )
        .map((item) => ({
          itemId: item.itemId,
          requestedQuantity: item.requestedQuantity,
          issuedQuantity: item.issuedQuantity ?? null,
          riskLevel: "High",
        })),
    };

    exportDashboardReportToPDF(reportData);
  }

  const suspiciousItemQueries = useQueries({
    queries: suspiciousItems.map((item) => ({
      queryKey: ["stockLogs", item.itemId],
      queryFn: () => fetchStockLogsByItem(item.itemId),
      enabled: !!item.itemId,
    })),
  });

  const dataForPie = [
    { name: "Matched", value: matchedOrders.length },
    { name: "Unmatched", value: unmatchedOrders.length },
  ];

  // Calculate Risk Levels
  const riskEvaluations = suspiciousItems.map((item) =>
    getRiskLevel(item.requestedQuantity, item.issuedQuantity)
  );

  const highRiskCount = riskEvaluations.filter(
    (r) => r.level === "high"
  ).length;
  const totalItems = suspiciousItems.length;
  const warehouseRiskScore = totalItems
    ? Math.max(0, 100 - (highRiskCount / totalItems) * 100)
    : 100;

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          🛡️ Stock Requests vs Orders Verification
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-2xl">
          This dashboard ensures that every stock request corresponds to a valid
          order to prevent stock misuse.
        </p>
      </div>

      {/* Risk Alert */}
      {highRiskCount > 3 && (
        <div className="bg-red-100 text-red-800 font-semibold p-4 mb-8 rounded-lg shadow-lg text-center">
          🚨 High number of risky items detected ({highRiskCount}). Immediate
          action recommended!
        </div>
      )}

      {/* Warehouse Risk Score */}
      <div className="bg-white dark:bg-gray-900 p-6 mb-12 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
          Warehouse Security Score
        </h2>
        <p className="text-5xl font-extrabold text-indigo-500 mb-4">
          {warehouseRiskScore.toFixed(0)}%
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          100% means completely safe — lower scores indicate potential risks.
        </p>

        {/* Download Button */}
        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 text-base font-medium">
          📄 Download PDF Report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <KpiCard title="Total Orders" value={orders.length} />
        <KpiCard title="Total Stock Requests" value={stockRequests.length} />
        <KpiCard title="Unmatched Orders" value={unmatchedOrders.length} />
        <KpiCard title="Unmatched Requests" value={unmatchedRequests.length} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ChartCard title="📈 Orders vs Stock Requests">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Overview",
                  Orders: orders.length,
                  Requests: stockRequests.length,
                },
              ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Orders" fill="#8884d8" />
              <Bar dataKey="Requests" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🎯 Matching Accuracy">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataForPie}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label>
                {dataForPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Suspicious Items */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-100">
          🚨 Suspicious Stock Request Items
        </h2>

        {suspiciousItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No suspicious items found. Everything is good ✅
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {suspiciousItems
              .map((item, index) => ({
                ...item,
                risk: getRiskLevel(item.requestedQuantity, item.issuedQuantity),
                query: suspiciousItemQueries[index],
              }))
              .sort((a, b) => b.risk.value - a.risk.value) // High Risk first
              .map((item, index) => {
                if (item.query?.isLoading)
                  return <p key={index}>Loading item {index + 1}...</p>;
                if (item.query?.isError || !item.query.data)
                  return <p key={index}>Error loading item {index + 1}</p>;

                const stockLogs = item.query.data;

                return (
                  <div
                    key={item.id}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-200">
                        Item ID: {item.itemId}
                      </span>
                      <span
                        className={`text-sm font-semibold ${item.risk.color}`}>
                        {item.risk.label}
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      Requested: {item.requestedQuantity}, Issued:{" "}
                      {item.issuedQuantity ?? "N/A"}
                    </div>

                    {/* Chart */}
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={stockLogs}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                          }
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="quantity"
                          stroke="#FF8042"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Explanation Label */}
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {analyzeStockTrend(stockLogs)}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

// Helpers

function sameDate(d1: string, d2: string) {
  return d1.split("T")[0] === d2.split("T")[0];
}

function getRiskLevel(requested: number, issued?: number | null) {
  const riskValue = requested - (issued ?? 0);

  if (riskValue > 5)
    return {
      level: "high",
      label: "🔥 High Risk",
      color: "text-red-500",
      value: riskValue,
    };
  if (riskValue > 2)
    return {
      level: "medium",
      label: "⚠️ Medium Risk",
      color: "text-yellow-500",
      value: riskValue,
    };
  return {
    level: "low",
    label: "✅ Low Risk",
    color: "text-green-500",
    value: riskValue,
  };
}

function analyzeStockTrend(stockLogs: { quantity: number }[]) {
  if (stockLogs.length < 2) return "Not enough data to analyze.";

  const first = stockLogs[0].quantity;
  const last = stockLogs[stockLogs.length - 1].quantity;

  if (last > first) return "Stock is increasing 📈.";
  if (last < first) return "Stock is decreasing 📉.";
  return "Stock is stable ⚖️.";
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-indigo-500">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}
