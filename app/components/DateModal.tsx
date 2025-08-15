import { IPO } from '../types/ipo';
import { formatPrice, getStatusColor } from '../utils/api';

interface DateModalProps {
  selectedDate: Date;
  ipos: IPO[];
  onClose: () => void;
}

export default function DateModal({
  selectedDate,
  ipos,
  onClose,
}: DateModalProps) {
  const dayIPOs = ipos.filter((ipo) => {
    if (!ipo.listing_date) return false;
    const ipoDate = new Date(ipo.listing_date);
    return (
      ipoDate.getDate() === selectedDate.getDate() &&
      ipoDate.getMonth() === selectedDate.getMonth() &&
      ipoDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {dayIPOs.length === 0 ? (
          <p className="text-slate-600">No IPOs scheduled for this date.</p>
        ) : (
          <div className="space-y-4">
            {dayIPOs.map((ipo, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900">{ipo.ticker}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      ipo.status
                    )}`}
                  >
                    {ipo.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-2">{ipo.name}</p>
                {ipo.sector && (
                  <p className="text-xs text-blue-600 mb-2">{ipo.sector}</p>
                )}
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Exchange: {ipo.exchange}</div>
                  {ipo.price_low && ipo.price_high && (
                    <div>
                      Price Range: {formatPrice(ipo.price_low)} -{' '}
                      {formatPrice(ipo.price_high)}
                    </div>
                  )}
                  {ipo.current_price && (
                    <div>Current Price: {formatPrice(ipo.current_price)}</div>
                  )}
                  {ipo.description && (
                    <div className="mt-2 text-slate-600">{ipo.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
