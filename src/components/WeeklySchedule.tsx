import React from 'react';
import { ScheduleData } from '../types';
import { DAY_NAMES } from '../utils/config';

interface WeeklyScheduleProps {
  schedule: ScheduleData | null;
  onSubjectClick: (subject: string) => void;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  schedule,
  onSubjectClick,
}) => {
  if (!schedule) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((dayIndex) => (
        <div
          key={dayIndex}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center justify-between">
            <h3 className="font-bold text-indigo-900">{DAY_NAMES[dayIndex]}</h3>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
              {schedule[dayIndex]?.length || 0}
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-3">
            {(schedule[dayIndex] || []).map((subject, idx) => (
              <button
                key={idx}
                onClick={() => onSubjectClick(subject)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="font-medium text-slate-700 text-left">{subject}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
