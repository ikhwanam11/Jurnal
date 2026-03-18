import React from 'react';
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { cn } from '../utils/classNames';
import { DAY_HEADERS } from '../utils/config';
import { ScheduleData, HolidaysData, SpecialPeriod } from '../types';
import { getSpecialPeriod } from '../utils/dateUtils';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  schedule: ScheduleData | null;
  holidays: HolidaysData | null;
  specialPeriods: SpecialPeriod[] | null;
  onDateClick: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  schedule,
  holidays,
  specialPeriods,
  onDateClick,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'd');
      const cloneDay = new Date(day);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSunday = i === 0;

      const dateStr = format(day, 'yyyy-MM-dd');
      const holiday = holidays?.[dateStr];
      const specialPeriod = specialPeriods ? getSpecialPeriod(day, specialPeriods) : null;

      const scheduleForDay = schedule?.[i] || [];

      days.push(
        <button
          key={day.toString()}
          onClick={() => onDateClick(cloneDay)}
          className={cn(
            "relative flex flex-col items-center justify-start pt-2 md:pt-3 pb-1 px-1 min-h-[48px] md:min-h-[90px] border border-slate-100 transition-all",
            !isCurrentMonth ? "bg-slate-50/50 text-slate-400" : "bg-white text-slate-800 hover:bg-indigo-50",
            isSelected && "ring-2 ring-indigo-600 ring-inset bg-indigo-50 z-10",
            isSunday && isCurrentMonth && "text-red-500",
            (holiday || specialPeriod) && isCurrentMonth && "bg-orange-50/30"
          )}
        >
          <span className={cn(
            "text-sm md:text-base font-medium z-10 mb-1",
            isSelected && "w-7 h-7 flex items-center justify-center bg-indigo-600 text-white rounded-full"
          )}>
            {formattedDate}
          </span>

          <div className="hidden md:flex flex-col items-center gap-1 w-full px-1 mt-auto">
            {holiday && (
              <span className="text-[9px] md:text-[10px] leading-tight text-red-600 font-medium text-center line-clamp-2">
                {holiday}
              </span>
            )}
            {specialPeriod && !holiday && (
              <span className="text-[9px] md:text-[10px] leading-tight text-orange-600 font-medium text-center line-clamp-2">
                {specialPeriod.name}
              </span>
            )}
            {isCurrentMonth && !isSunday && !holiday && !specialPeriod && scheduleForDay.length > 0 && (
              <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                {scheduleForDay.slice(0, 4).map((_, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                ))}
                {scheduleForDay.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
              </div>
            )}
          </div>
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-0" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-7 gap-0 border-b border-slate-200 bg-slate-50">
        {DAY_HEADERS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center font-semibold text-xs md:text-sm py-3",
              i === 0 ? "text-red-500" : "text-slate-600"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      {rows}
    </div>
  );
};
