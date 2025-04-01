"use client";

import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; // feather icon for logout
import { motion } from "framer-motion";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <motion.button
      onClick={handleLogout}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-300 shadow-md">
      <FiLogOut className="text-lg" />
      Logout
    </motion.button>
  );
}
