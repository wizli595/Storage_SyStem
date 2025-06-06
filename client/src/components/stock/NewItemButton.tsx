"use client";

import { FaPlus } from "react-icons/fa";

interface NewItemButtonProps {
  onClick: () => void;
}

export default function NewItemButton({ onClick }: NewItemButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">
      <FaPlus />
      New Item
    </button>
  );
}
