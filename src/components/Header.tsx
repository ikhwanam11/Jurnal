import React from 'react';
import { BookOpen } from 'lucide-react';
import { CONFIG } from '../utils/config';

export const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white pt-8 pb-16 px-6 rounded-b-[32px] shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-400 blur-3xl"></div>
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">Jurnal Mengajar</h1>
        <p className="text-indigo-100 text-base md:text-lg font-medium">{CONFIG.CLASS_NAME}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs md:text-sm font-medium text-indigo-100">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            {CONFIG.TEACHER_NAME}
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <BookOpen className="w-3.5 h-3.5" />
            {CONFIG.SCHOOL_NAME}
          </div>
        </div>
      </div>
    </header>
  );
};
