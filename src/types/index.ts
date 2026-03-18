export interface LessonData {
  BAB: string;
  Pertemuan: string;
  'Aktivitas Pembelajaran': string;
  'Tujuan Pembelajaran (TP)': string;
  'Halaman (BS/BG)': string;
  Tanggal: string;
  Materi: string;
  Soal: string;
}

export interface SpecialPeriod {
  name: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  message: string;
  color: string;
}

export interface ScheduleData {
  [dayIndex: number]: string[];
}

export interface HolidaysData {
  [dateString: string]: string;
}
