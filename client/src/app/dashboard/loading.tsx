import { SkeletonChart } from "@/components/dashboard";
import { SkeletonCard } from "@/components/stock";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonChart />
      <SkeletonChart />
    </div>
  );
}
