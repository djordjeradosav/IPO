import {
  Calendar,
  DollarSign,
  Users,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { IPO } from '../types/ipo';
import {
  formatDate,
  formatPrice,
  formatMarketCap,
  formatShares,
  getStatusColor,
} from '../utils/api';

interface IPOCardProps {
  ipo: IPO;
  index: number;
}

export default function IPOCard({ ipo, index }: IPOCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {ipo.ticker.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{ipo.ticker}</h3>
            <p className="text-sm text-slate-600">{ipo.exchange}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            ipo.status
          )}`}
        >
          {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
        </span>
      </div>

      <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">
        {ipo.name}
      </h4>

      {ipo.sector && (
        <p className="text-sm text-blue-600 mb-2 font-medium">{ipo.sector}</p>
      )}

      {ipo.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {ipo.description}
        </p>
      )}

      {/* Key Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Listing Date
          </span>
          <span className="font-semibold text-slate-800">
            {formatDate(ipo.listing_date)}
          </span>
        </div>

        {ipo.status === 'live' && ipo.current_price ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Current Price
            </span>
            <span className="font-semibold text-green-600">
              {formatPrice(ipo.current_price)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price Range
            </span>
            <span className="font-semibold text-slate-800">
              {ipo.price_low && ipo.price_high
                ? `${formatPrice(ipo.price_low)} - ${formatPrice(
                    ipo.price_high
                  )}`
                : 'TBD'}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Shares
          </span>
          <span className="font-semibold text-slate-800">
            {formatShares(ipo.shares_outstanding || 0)}
          </span>
        </div>

        {ipo.market_cap && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Market Cap
            </span>
            <span className="font-semibold text-slate-800">
              {formatMarketCap(ipo.market_cap)}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">
        <span className="font-medium">View Details</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
