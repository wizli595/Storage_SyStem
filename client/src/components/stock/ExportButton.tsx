"use client";

import { FaDownload } from "react-icons/fa";

interface ExportButtonProps {
  onExport: () => void;
}

export default function ExportButton({ onExport }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition">
      <FaDownload />
      Export CSV
    </button>
  );
}
