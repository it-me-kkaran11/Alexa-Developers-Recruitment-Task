"use client";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again later",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="space-y-4 text-center">
        <div className="text-5xl">❌</div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "No data",
  message = "Nothing to display",
  icon = "📭",
}: {
  title?: string;
  message?: string;
  icon?: string;
}) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="space-y-4 text-center">
        <div className="text-5xl">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
