"use client";

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">😕</div>
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-neutral-500 mb-4">
        {message || "Failed to load data."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
