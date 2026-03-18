import React from 'react';
import { CalendarDays, LayoutGrid, ChevronRight } from 'lucide-react';
import { cn } from '../utils/classNames';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CONFIG } from '../utils/config';

interface ViewToggleProps {
  viewMode: 'calendar' | 'weekly';
  currentDate: Date;
  onViewModeChange: (mode: 'calendar' | 'weekly') => void;
  onMonthChange: (monthIndex: number) => void;
  onYearChange: (year: number) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  currentDate,
  onViewModeChange,
  onMonthChange,
  onYearChange,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => 
    format(new Date(2026, i, 1), 'MMMM', { locale: id })
  );

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => onViewModeChange('calendar')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            viewMode === 'calendar' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <CalendarDays className="w-4 h-4" />
          Kalender
        </button>
        <button
          onClick={() => onViewModeChange('weekly')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            viewMode === 'weekly' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          Mingguan
        </button>
      </div>

      {viewMode === 'calendar' && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CONFIG.YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};
