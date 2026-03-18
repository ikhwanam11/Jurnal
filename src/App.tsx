import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen, AlertCircle, X, LayoutGrid, CalendarDays } from 'lucide-react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Types ---
interface LessonData {
  BAB: string;
  Pertemuan: string;
  'Aktivitas Pembelajaran': string;
  'Tujuan Pembelajaran (TP)': string;
  'Halaman (BS/BG)': string;
  Tanggal: string;
  Materi: string;
  Soal: string;
}

// --- Constants ---
const SCHEDULE: Record<number, string[]> = {
  1: ['Upacara', 'PJOK', 'IPAS', 'Seni Budaya'],
  2: ['Matematika', 'IPAS', 'Bahasa Indonesia'],
  3: ['Bahasa Indonesia', 'Pendidikan Pancasila', 'Bahasa Inggris'],
  4: ['Matematika', 'Pendidikan Pancasila', 'Bahasa Lampung'],
  5: ['Matematika', 'Bahasa Indonesia'],
  6: ['Pendidikan Agama', 'Koding'],
  0: [],
};

const DAY_NAMES: Record<number, string> = {
  1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 0: 'Minggu'
};

const SHEET_MAPPING: Record<string, string> = {
  'Bahasa Indonesia': 'Indo',
  'Matematika': 'mtk',
  'IPAS': 'IPAS',
  'Pendidikan Pancasila': 'PKN',
  'Seni Budaya': 'seni',
};

const SPREADSHEET_ID = '1ODkiSNZfQ5Z78dcNu3cs3JHRtLGpy0pHn35LMxtDJz0';

// Special Dates (2026)
const SPECIAL_PERIODS = [
  { name: 'Libur Awal Ramadhan', start: new Date(2026, 1, 16), end: new Date(2026, 1, 21), message: 'Libur menyambut bulan suci Ramadhan', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { name: 'Libur Idul Fitri', start: new Date(2026, 2, 16), end: new Date(2026, 2, 28), message: 'Libur Hari Raya Idul Fitri', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { name: 'PTS (Genap)', start: new Date(2026, 3, 6), end: new Date(2026, 3, 11), message: 'Penilaian Tengah Semester', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { name: 'PAS (Genap)', start: new Date(2026, 5, 2), end: new Date(2026, 5, 7), message: 'Penilaian Akhir Semester', color: 'bg-red-100 text-red-800 border-red-200' },
  { name: 'Bagi Raport', start: new Date(2026, 5, 19), end: new Date(2026, 5, 19), message: 'Pembagian Raport Semester Genap', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Libur Semester', start: new Date(2026, 5, 20), end: new Date(2026, 6, 12), message: 'Libur Semester Genap (Masuk 13 Juli)', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

const DEADLINE_RAPORT = new Date(2026, 11, 18); // Dec 18, 2026

// Holidays 2026 (Approximations for Indonesia)
const HOLIDAYS: Record<string, string> = {
  '2026-01-01': 'Tahun Baru 2026 Masehi',
  '2026-01-16': 'Isra Mikraj Nabi Muhammad S.A.W.',
  '2026-02-16': 'Cuti Bersama Tahun Baru Imlek 2577 Kongzili',
  '2026-02-17': 'Tahun Baru Imlek 2576 Kongzili',
  '2026-03-18': 'Cuti Bersama Hari Suci Nyepi',
  '2026-03-19': 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
  '2026-03-20': 'Cuti Bersama Idulfitri 1447 Hijriah',
  '2026-03-21': 'Idulfitri 1447 Hijriah',
  '2026-03-22': 'Idulfitri 1447 Hijriah',
  '2026-03-23': 'Cuti Bersama Idulfitri 1447 Hijriah',
  '2026-03-24': 'Cuti Bersama Idulfitri 1447 Hijriah',
  '2026-04-03': 'Wafat Yesus Kristus',
  '2026-04-05': 'Kebangkitan Yesus Kristus (Paskah)',
  '2026-05-01': 'Hari Buruh Internasional',
  '2026-05-14': 'Kenaikan Yesus Kristus',
  '2026-05-15': 'Cuti Bersama Kenaikan Yesus Kristus',
  '2026-05-27': 'Iduladha 1447 Hijriah',
  '2026-05-28': 'Cuti Bersama Iduladha 1447 Hijriah',
  '2026-05-31': 'Hari Raya Waisak 2570 BE',
  '2026-06-01': 'Hari Lahir Pancasila',
  '2026-06-16': 'Tahun Baru Islam 1448 Hijriah',
  '2026-08-17': 'Proklamasi Kemerdekaan',
  '2026-08-25': 'Maulid Nabi Muhammad S.A.W',
  '2026-12-25': 'Kelahiran Yesus Kristus',
  '2026-12-26': 'Cuti Bersama Kelahiran Yesus Kristus',
};

// --- Utils ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

function getSpecialPeriod(date: Date) {
  return SPECIAL_PERIODS.find((p) => isWithinInterval(date, { start: p.start, end: p.end }));
}

function getHoliday(date: Date) {
  const dateString = format(date, 'yyyy-MM-dd');
  return HOLIDAYS[dateString];
}

// --- Components ---

const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Default to March 2026 for demo purposes based on user request
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'calendar' | 'weekly'>('calendar');
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const goToMonth = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
  };

  const goToYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const handleSubjectClick = (subject: string, date: Date) => {
    setSelectedSubject(subject);
    setIsLessonModalOpen(true);
    fetchLessonData(subject, date);
  };

  const fetchLessonData = async (subject: string, date: Date) => {
    setLoading(true);
    setError(null);
    setLessonData(null);

    const sheetName = SHEET_MAPPING[subject] || subject;
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari spreadsheet.');
      }
      const csvText = await response.text();
      
      Papa.parse<LessonData>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            setError('Format data tidak sesuai atau sheet tidak ditemukan.');
            setLoading(false);
            return;
          }

          const targetDateStr = format(date, 'dd/MM/yyyy');
          const targetDateStr2 = format(date, 'd/M/yyyy');
          const targetDateStr3 = format(date, 'dd-MM-yyyy');
          const targetDateStr4 = format(date, 'yyyy-MM-dd');
          const targetDateStr5 = format(date, 'd/MM/yyyy');
          const targetDateStr6 = format(date, 'dd/M/yyyy');
          const targetDateStr7 = format(date, 'd-M-yyyy');
          const targetDateStr8 = format(date, 'dd MMM yyyy', { locale: id });
          const targetDateStr9 = format(date, 'd MMM yyyy', { locale: id });
          const targetDateStr10 = format(date, 'dd MMMM yyyy', { locale: id });
          const targetDateStr11 = format(date, 'd MMMM yyyy', { locale: id });
          const targetDateStr12 = format(date, 'M/d/yyyy');
          const targetDateStr13 = format(date, 'MM/dd/yyyy');

          const matchingRows = results.data.filter((row) => {
            const rowDate = row.Tanggal?.trim();
            if (!rowDate) return false;
            return [
              targetDateStr, targetDateStr2, targetDateStr3, targetDateStr4,
              targetDateStr5, targetDateStr6, targetDateStr7, targetDateStr8,
              targetDateStr9, targetDateStr10, targetDateStr11, targetDateStr12,
              targetDateStr13
            ].includes(rowDate);
          });

          if (matchingRows.length > 0) {
            setLessonData(matchingRows[matchingRows.length - 1]);
          } else {
            setError('Tidak ada data pembelajaran untuk tanggal ini.');
          }
          setLoading(false);
        },
        error: (err: any) => {
          setError('Gagal memproses data CSV: ' + err.message);
          setLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
      setLoading(false);
    }
  };

  const renderFilterAndToggle = () => {
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(2026, i, 1), 'MMMM', { locale: id }));
    const years = [2025, 2026, 2027];

    return (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              viewMode === 'calendar' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <CalendarDays className="w-4 h-4" />
            Kalender
          </button>
          <button
            onClick={() => setViewMode('weekly')}
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
                onChange={(e) => goToMonth(Number(e.target.value))}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => goToYear(Number(e.target.value))}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSunday = i === 0;
        const holiday = getHoliday(day);
        const specialPeriod = getSpecialPeriod(day);

        days.push(
          <button
            key={day.toString()}
            onClick={() => handleDateClick(cloneDay)}
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
              {isCurrentMonth && !isSunday && !holiday && !specialPeriod && (
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {SCHEDULE[i]?.slice(0, 4).map((_, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  ))}
                  {SCHEDULE[i]?.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
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
          {dayHeaders.map((day, i) => (
            <div key={day} className={cn(
              "text-center font-semibold text-xs md:text-sm py-3",
              i === 0 ? "text-red-500" : "text-slate-600"
            )}>
              {day}
            </div>
          ))}
        </div>
        {rows}
      </div>
    );
  };

  const renderWeeklySchedule = () => {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-indigo-900">{DAY_NAMES[dayIndex]}</h3>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                {SCHEDULE[dayIndex].length}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-3">
              {SCHEDULE[dayIndex].map((subject, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <span className="font-medium text-slate-700">{subject}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayModalContent = () => {
    if (!selectedDate) return null;

    const dayOfWeek = selectedDate.getDay();
    const schedule = SCHEDULE[dayOfWeek];
    const holiday = getHoliday(selectedDate);
    const specialPeriod = getSpecialPeriod(selectedDate);
    const isPastDeadline = selectedDate > DEADLINE_RAPORT;

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
        ) : schedule && schedule.length > 0 ? (
          <div className="grid gap-3">
            {schedule.map((subject, idx) => (
              <button
                key={idx}
                onClick={() => handleSubjectClick(subject, selectedDate)}
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

  const renderLessonModalContent = () => {
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

  const renderHolidayList = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    
    // Get holidays for current month
    const currentMonthHolidays = Object.entries(HOLIDAYS).filter(([dateStr]) => {
      const date = parseISO(dateStr);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    }).map(([dateStr, name]) => ({
      date: parseISO(dateStr),
      endDate: undefined,
      name,
      message: undefined,
      type: 'holiday',
      color: undefined
    }));

    // Get special periods for current month
    const currentMonthSpecialPeriods = SPECIAL_PERIODS.filter(period => {
      // Check if period overlaps with current month
      return (period.start <= monthEnd && period.end >= monthStart);
    }).map(period => ({
      date: period.start > monthStart ? period.start : monthStart,
      endDate: period.end < monthEnd ? period.end : monthEnd,
      name: period.name,
      message: period.message,
      type: 'special',
      color: period.color
    }));

    const allEvents = [...currentMonthHolidays, ...currentMonthSpecialPeriods].sort((a, b) => a.date.getTime() - b.date.getTime());

    if (allEvents.length === 0) return null;

    return (
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-700 text-sm">Agenda & Hari Libur Bulan Ini</h3>
        </div>
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {allEvents.map((event, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
              <div className={cn(
                "w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 border",
                event.type === 'holiday' ? "bg-red-50 text-red-600 border-red-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
              )}>
                <span className="text-[9px] font-medium uppercase leading-none mb-0.5">{format(event.date, 'MMM', { locale: id })}</span>
                <span className="text-sm font-bold leading-none">{format(event.date, 'd')}</span>
              </div>
              <div className="pt-0.5">
                <p className="font-bold text-slate-800 text-xs leading-tight">{event.name}</p>
                {event.type === 'special' && event.message && (
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">{event.message}</p>
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-indigo-600 text-white pt-8 pb-16 px-6 rounded-b-[32px] shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-400 blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">Jurnal Mengajar</h1>
          <p className="text-indigo-100 text-base md:text-lg font-medium">Kelas 4</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs md:text-sm font-medium text-indigo-100">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Ikhwanudin Amri, S.I.P.
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <BookOpen className="w-3.5 h-3.5" />
              UPT SDN 1 Padangrejo
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-4 md:p-8">
          {renderFilterAndToggle()}
          
          <AnimatePresence mode="wait">
            {viewMode === 'calendar' ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {renderCells()}
                {renderHolidayList()}
              </motion.div>
            ) : (
              <motion.div
                key="weekly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {renderWeeklySchedule()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        title={selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id }) : 'Jadwal'}
      >
        {renderDayModalContent()}
      </Modal>

      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title={`Rincian: ${selectedSubject || ''}`}
      >
        {renderLessonModalContent()}
      </Modal>
    </div>
  );
}
