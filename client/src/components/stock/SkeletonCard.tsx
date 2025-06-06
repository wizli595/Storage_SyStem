export default function SkeletonCard() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 mb-4 rounded"></div>
      <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
}
