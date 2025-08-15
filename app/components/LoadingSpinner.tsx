export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-lg">Loading real IPO data...</p>
        <p className="text-slate-500 text-sm mt-2">
          Fetching from financial APIs...
        </p>
      </div>
    </div>
  );
}
