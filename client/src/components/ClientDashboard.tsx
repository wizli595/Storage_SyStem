"use client";

import { motion } from "framer-motion";

type Props = {
  userId: string;
};

export default function ClientDashboard({ userId }: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8">
      <motion.h1
        variants={fadeInUp}
        className="text-3xl font-bold mb-6 text-center sm:text-left">
        📊 Welcome, User {userId}
      </motion.h1>

      <motion.div
        variants={staggerCards}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card title="Total Stock" value="12,340" />
        <Card title="Orders Today" value="89" />
        <Card title="Low Stock Alerts" value="4" />
      </motion.div>
    </motion.div>
  );
}

// Reusable card component with animation
const Card = ({ title, value }: { title: string; value: string }) => (
  <motion.div
    variants={cardVariants}
    className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerCards = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
