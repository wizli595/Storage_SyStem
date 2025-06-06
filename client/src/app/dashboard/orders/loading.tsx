export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
      ))}
    </div>
  );
}
