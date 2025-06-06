"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ItemStockTrendsProps {
  groupedByItem: {
    [itemId: string]: { date: string; quantity: number }[];
  };
}

export default function ItemStockTrends({
  groupedByItem,
}: ItemStockTrendsProps) {
  return (
    <div className="p-6 sm:p-8 bg-gray-100 dark:bg-gray-950 rounded-xl shadow-lg mt-12 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-100">
        📉 Item Wise Stock Trends
      </h2>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg">
        {Object.entries(groupedByItem).map(([itemId, logs]) => (
          <SwiperSlide key={itemId}>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 break-all">
                Item ID: {itemId}
              </h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={logs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#3B82F6",
                        color: "#E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="quantity"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
