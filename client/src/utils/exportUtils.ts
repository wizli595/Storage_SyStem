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
    itemName?: string;
    requestedQuantity: number;
    issuedQuantity: number | null;
    riskLevel: string; // "High", "Medium", "Low"
  }[];
};

export function exportDashboardReportToPDF(data: DashboardReport) {
  const doc = new jsPDF();

  // === Company Header ===
  doc.setFontSize(20);
  doc.setTextColor(33, 33, 33);
  doc.setFont("helvetica", "bold");
  doc.text("WareSecure Inc.", 10, 15);

  // Logo Placeholder
  doc.setDrawColor(200);
  doc.rect(150, 5, 40, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Company Logo", 155, 17);

  // === Report Title ===
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text("Warehouse Security Dashboard Report", 10, 35);

  // === Metadata Section ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const meta = [
    `Date: ${data.date}`,
    `Total Orders: ${data.totalOrders}`,
    `Total Stock Requests: ${data.totalStockRequests}`,
    `Unmatched Orders: ${data.unmatchedOrders}`,
    `Unmatched Requests: ${data.unmatchedRequests}`,
    `Warehouse Risk Score: ${data.warehouseRiskScore.toFixed(0)}%`,
  ];
  meta.forEach((text, i) => {
    doc.text(text, 10, 45 + i * 8);
  });

  // === Section Title ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(33, 33, 33);
  doc.text("High Risk Stock Items", 10, 100);

  // === Table Data ===
  const tableData = data.highRiskItems.map((item) => [
    item.itemId,
    item.itemName ?? "N/A",
    item.requestedQuantity,
    item.issuedQuantity ?? "N/A",
    item.riskLevel,
  ]);

  autoTable(doc, {
    head: [
      [
        "Item ID",
        "Item Name",
        "Requested Quantity",
        "Issued Quantity",
        "Risk Level",
      ],
    ],
    body: tableData,
    startY: 105,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      halign: "left",
    },
    headStyles: {
      fillColor: [58, 58, 158],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    tableLineColor: 230,
    tableLineWidth: 0.1,
  });

  // === Signature Section ===
  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 25;

  doc.setDrawColor(180);
  doc.line(10, finalY, 80, finalY);
  doc.text("Authorized Signature", 10, finalY + 7);

  doc.line(150, finalY, 200, finalY);
  doc.text("Date", 150, finalY + 7);

  // === Save ===
  doc.save(`Warehouse_Security_Report_${data.date}.pdf`);
}
