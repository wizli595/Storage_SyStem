// src/utils/exportUtils.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { StockLog } from "@/server/stockLogs/stockLogSchemas";

export function exportToExcel(data: StockLog[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "StockLogs");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToPDF(data: StockLog[], title: string) {
  const doc = new jsPDF();

  const tableData = data.map((log) => [
    new Date(log.date).toLocaleDateString(),
    log.itemId,
    log.quantity,
    log.actionBy,
    log.changeType,
  ]);

  doc.text(title, 10, 10);
  autoTable(doc, {
    head: [["Date", "Item ID", "Quantity", "Action By", "Change Type"]],
    body: tableData,
  });

  doc.save(`${title}.pdf`);
}
type DashboardReport = {
  date: string;
  totalOrders: number;
  totalStockRequests: number;
  unmatchedOrders: number;
  unmatchedRequests: number;
  warehouseRiskScore: number;
  highRiskItems: {
    itemId: string;
    requestedQuantity: number;
    issuedQuantity: number | null;
    riskLevel: string; // "High", "Medium", "Low"
  }[];
};

export function exportDashboardReportToPDF(data: DashboardReport) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Warehouse Security Dashboard Report", 10, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${data.date}`, 10, 30);
  doc.text(`Total Orders: ${data.totalOrders}`, 10, 40);
  doc.text(`Total Stock Requests: ${data.totalStockRequests}`, 10, 50);
  doc.text(`Unmatched Orders: ${data.unmatchedOrders}`, 10, 60);
  doc.text(`Unmatched Requests: ${data.unmatchedRequests}`, 10, 70);
  doc.text(
    `Warehouse Risk Score: ${data.warehouseRiskScore.toFixed(0)}%`,
    10,
    80
  );

  doc.text("High Risk Items:", 10, 95);

  const tableData = data.highRiskItems.map((item) => [
    item.itemId,
    item.requestedQuantity,
    item.issuedQuantity ?? "N/A",
    item.riskLevel,
  ]);

  autoTable(doc, {
    head: [["Item ID", "Requested Quantity", "Issued Quantity", "Risk Level"]],
    body: tableData,
    startY: 100,
  });

  doc.save(`Warehouse_Security_Report_${data.date}.pdf`);
}
