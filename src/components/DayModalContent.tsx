import React from 'react';
import { AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/classNames';
import { CONFIG } from '../utils/config';
import { ScheduleData, HolidaysData, SpecialPeriod } from '../types';
import { getSpecialPeriod } from '../utils/dateUtils';

interface DayModalContentProps {
  selectedDate: Date;
  schedule: ScheduleData | null;
  holidays: HolidaysData | null;
  specialPeriods: SpecialPeriod[] | null;
  onSubjectClick: (subject: string) => void;
}

export const DayModalContent: React.FC<DayModalContentProps> = ({
  selectedDate,
  schedule,
  holidays,
  specialPeriods,
  onSubjectClick,
}) => {
  const dayOfWeek = selectedDate.getDay();
  const scheduleForDay = schedule?.[dayOfWeek] || [];
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const holiday = holidays?.[dateStr];
  const specialPeriod = specialPeriods ? getSpecialPeriod(selectedDate, specialPeriods) : null;
  const isPastDeadline = selectedDate > CONFIG.DEADLINE_RAPORT;

  return (
    <div className="space-y-4">
      {isPastDeadline && (
        <div className="p-4 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Batas Akhir Terlewati</p>
            <p className="text-sm mt-1">Tanggal ini melewati batas akhir sebelum pembagian raport (18 Desember 2026).</p>
          </div>
        </div>
      )}

      {holiday ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Libur Nasional</p>
            <p className="text-sm mt-1">{holiday}</p>
          </div>
        </div>
      ) : specialPeriod ? (
        <div className={cn("p-4 rounded-xl border flex items-start gap-3", specialPeriod.color)}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{specialPeriod.name}</p>
            <p className="text-sm mt-1">{specialPeriod.message}</p>
          </div>
        </div>
      ) : dayOfWeek === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
          <p>Hari Minggu - Libur</p>
        </div>
      ) : scheduleForDay.length > 0 ? (
        <div className="grid gap-3">
          {scheduleForDay.map((subject, idx) => (
            <button
              key={idx}
              onClick={() => onSubjectClick(subject)}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">{subject}</span>
                  <span className="text-xs text-slate-500">Klik untuk melihat rincian</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
          <p>Tidak ada jadwal untuk hari ini.</p>
        </div>
      )}
    </div>
  );
};
