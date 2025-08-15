'use client';

import { useState, useEffect } from 'react';
import { IPO, PolygonAPIResponse, APIError } from '../types/ipo';

export default function IPOList() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIPOs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/ipos');
      const data: PolygonAPIResponse | APIError = await response.json();

      if (!response.ok) {
        throw new Error('error' in data ? data.error : 'Failed to fetch IPOs');
      }

      if ('results' in data) {
        setIpos(data.results || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setIpos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPOs();
  }, []);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price: number): string => {
    if (!price || isNaN(price)) return 'TBD';
    return `${price.toFixed(2)}`;
  };

  const formatShares = (shares: number): string => {
    if (!shares || isNaN(shares)) return 'TBD';
    return shares.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-slate-600">Loading IPO data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md w-full">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Error Loading IPOs
          </h3>
          <p className="text-red-700 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={fetchIPOs}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-slate-800">
          Recent IPOs ({ipos.length})
        </h2>
        <button
          onClick={fetchIPOs}
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Empty State */}
      {ipos.length === 0 ? (
        <div className="text-center py-12 px-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="max-w-md mx-auto">
            <p className="text-lg text-slate-600 mb-4">No IPOs found.</p>
            <div className="text-left">
              <p className="text-slate-600 mb-3">This could mean:</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  Your API key needs to be configured
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  There are no recent IPOs in the database
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  The API service is temporarily unavailable
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* IPO Grid */
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {ipos.map((ipo, index) => (
            <div
              key={`${ipo.ticker}-${index}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                    {ipo.ticker}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {ipo.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  {ipo.name}
                </h3>
                <p className="text-slate-500 font-medium">{ipo.exchange}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">
                    Listing Date
                  </span>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatDate(ipo.listing_date)}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">
                    Price Range
                  </span>
                  <div className="text-sm font-semibold text-slate-800">
                    {ipo.price_low && ipo.price_high
                      ? `${formatPrice(ipo.price_low)} - ${formatPrice(
                          ipo.price_high
                        )}`
                      : 'TBD'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">
                    Shares Offered
                  </span>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatShares(ipo.shares_outstanding || 0)}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-500">
                    US Code
                  </span>
                  <div className="text-sm font-semibold text-slate-800">
                    {ipo.us_code || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
