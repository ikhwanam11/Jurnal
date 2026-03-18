import React from 'react';
import { AlertCircle } from 'lucide-react';
import { LessonData } from '../types';

interface LessonModalContentProps {
  loading: boolean;
  error: string | null;
  lessonData: LessonData | null;
}

export const LessonModalContent: React.FC<LessonModalContentProps> = ({
  loading,
  error,
  lessonData,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium">Memuat data pembelajaran...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-orange-50 text-orange-800 rounded-2xl border border-orange-200 flex flex-col items-center text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-orange-500" />
        <div>
          <p className="font-bold text-lg mb-1">Gagal Memuat Data</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  if (!lessonData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">BAB</p>
          <p className="font-bold text-slate-800 text-lg">{lessonData.BAB || '-'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Pertemuan Ke</p>
          <p className="font-bold text-slate-800 text-lg">{lessonData.Pertemuan || '-'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Halaman Buku</p>
          <p className="font-bold text-slate-800 text-lg">{lessonData['Halaman (BS/BG)'] || '-'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Tanggal Tercatat</p>
          <p className="font-bold text-slate-800 text-lg">{lessonData.Tanggal || '-'}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
            Tujuan Pembelajaran (TP)
          </h5>
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {lessonData['Tujuan Pembelajaran (TP)'] || '-'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
            Aktivitas Pembelajaran
          </h5>
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {lessonData['Aktivitas Pembelajaran'] || '-'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full">
            <h5 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
              Materi
            </h5>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {lessonData.Materi || '-'}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full">
            <h5 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
              Soal
            </h5>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {lessonData.Soal || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
