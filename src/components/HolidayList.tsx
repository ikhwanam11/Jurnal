import React, { useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { HolidaysData, SpecialPeriod } from '../types';
import { getSpecialPeriod } from '../utils/dateUtils';

interface HolidayListProps {
  currentDate: Date;
  holidays: HolidaysData | null;
  specialPeriods: SpecialPeriod[] | null;
}

interface Event {
  date: Date;
  endDate?: Date;
  name: string;
  message?: string;
  type: 'holiday' | 'special';
  color?: string;
}

export const HolidayList: React.FC<HolidayListProps> = ({
  currentDate,
  holidays,
  specialPeriods,
}) => {
  const allEvents = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);

    // Get holidays for current month
    const currentMonthHolidays: Event[] = (holidays ? Object.entries(holidays) : [])
      .filter(([dateStr]) => {
        const date = parseISO(dateStr);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      })
      .map(([dateStr, name]) => ({
        date: parseISO(dateStr),
        name: name as string,
        type: 'holiday' as const,
      }));

    // Get special periods for current month
    const currentMonthSpecialPeriods: Event[] = (specialPeriods || [])
      .filter((period) => {
        const startDate = parseISO(period.start);
        const endDate = parseISO(period.end);
        return startDate <= monthEnd && endDate >= monthStart;
      })
      .map((period) => {
        const startDate = parseISO(period.start);
        const endDate = parseISO(period.end);
        return {
          date: startDate > monthStart ? startDate : monthStart,
          endDate: endDate < monthEnd ? endDate : monthEnd,
          name: period.name,
          message: period.message,
          type: 'special' as const,
          color: period.color,
        };
      });

    return [...currentMonthHolidays, ...currentMonthSpecialPeriods].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [currentDate, holidays, specialPeriods]);

  if (allEvents.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-slate-500" />
        <h3 className="font-bold text-slate-700 text-sm">Agenda & Hari Libur Bulan Ini</h3>
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {allEvents.map((event, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
          >
            <div className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 border ${
              event.type === 'holiday'
                ? 'bg-red-50 text-red-600 border-red-100'
                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}>
              <span className="text-[9px] font-medium uppercase leading-none mb-0.5">
                {format(event.date, 'MMM', { locale: id })}
              </span>
              <span className="text-sm font-bold leading-none">
                {format(event.date, 'd')}
              </span>
            </div>
            <div className="pt-0.5">
              <p className="font-bold text-slate-800 text-xs leading-tight">{event.name}</p>
              {event.type === 'special' && event.message && (
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                  {event.message}
                </p>
              )}
              {event.type === 'special' && event.endDate && !isSameDay(event.date, event.endDate) && (
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  s/d {format(event.endDate, 'd MMM yyyy', { locale: id })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
