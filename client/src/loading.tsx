export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-8 transition-colors duration-300">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-800 dark:border-gray-100"></div>
    </div>
  );
}
