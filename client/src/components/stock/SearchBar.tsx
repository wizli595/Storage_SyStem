"use client";

import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.input
      type="text"
      placeholder="Search items..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow focus:ring focus:border-indigo-500 transition-all"
      whileFocus={{ scale: 1.02 }}
    />
  );
}
