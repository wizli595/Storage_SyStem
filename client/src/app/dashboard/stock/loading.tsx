import { SkeletonCard } from "@/components/stock";

export default function Loading() {
  return Array.from({ length: 6 }).map((_, index) => (
    <SkeletonCard key={index} />
  ));
}
