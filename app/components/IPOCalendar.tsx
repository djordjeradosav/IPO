import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IPO, CalendarDay } from '../types/ipo';

interface IPOCalendarProps {
  ipos: IPO[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onDateSelect: (date: Date) => void;
}

export default function IPOCalendar({
  ipos,
  currentDate,
  setCurrentDate,
  onDateSelect,
}: IPOCalendarProps) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);

      const dayIPOs = ipos.filter((ipo) => {
        if (!ipo.listing_date) return false;
        const ipoDate = new Date(ipo.listing_date);
        return (
          ipoDate.getDate() === currentDay.getDate() &&
          ipoDate.getMonth() === currentDay.getMonth() &&
          ipoDate.getFullYear() === currentDay.getFullYear()
        );
      });

      days.push({
        date: new Date(currentDay),
        day: currentDay.getDate(),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday:
          currentDay.getDate() === today.getDate() &&
          currentDay.getMonth() === today.getMonth() &&
          currentDay.getFullYear() === today.getFullYear(),
        ipos: dayIPOs,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays(currentDate);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
            )
          }
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
            )
          }
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-3 text-center font-semibold text-slate-600 border-b border-slate-200"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] p-2 border border-slate-200 ${
              !day.isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'
            } ${
              day.isToday ? 'bg-blue-50 ring-2 ring-blue-200' : ''
            } hover:bg-slate-50 transition-colors cursor-pointer`}
            onClick={() => onDateSelect(day.date)}
          >
            <div
              className={`text-sm font-medium mb-1 ${
                day.isToday ? 'text-blue-600' : ''
              }`}
            >
              {day.day}
            </div>
            <div className="space-y-1">
              {day.ipos.slice(0, 2).map((ipo, ipoIndex) => (
                <div
                  key={ipoIndex}
                  className={`text-xs px-2 py-1 rounded text-white truncate ${
                    ipo.status === 'live'
                      ? 'bg-green-500'
                      : ipo.status === 'filed'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  title={`${ipo.ticker} - ${ipo.name}`}
                >
                  {ipo.ticker}
                </div>
              ))}
              {day.ipos.length > 2 && (
                <div className="text-xs text-slate-500 px-2">
                  +{day.ipos.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
