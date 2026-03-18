import { LessonData, SpecialPeriod, ScheduleData, HolidaysData } from '../types';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const API_BASE = isDev ? 'http://localhost:5000/api' : '/api';

// Google Sheets Configuration
const SPREADSHEET_ID = '1ODkiSNZfQ5Z78dcNu3cs3JHRtLGpy0pHn35LMxtDJz0';

// Sheet name mappings - adjust based on actual sheet names in your spreadsheet
export const SHEET_MAPPING: Record<string, string> = {
  'Bahasa Indonesia': 'Indo',
  'Matematika': 'mtk',
  'IPAS': 'IPAS',
  'Pendidikan Pancasila': 'PKN',
  'Seni Budaya': 'seni',
  'Bahasa Inggris': 'English',
  'Bahasa Lampung': 'Lampung',
  'Pendidikan Agama': 'Agama',
  'PJOK': 'PJOK',
  'Koding': 'Koding',
  'Upacara': 'Upacara',
};

// Fetch schedule data
export async function fetchSchedule(): Promise<ScheduleData> {
  try {
    const response = await fetch(`${API_BASE}/schedule`);
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return response.json();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
}

// Fetch holidays data
export async function fetchHolidays(): Promise<HolidaysData> {
  try {
    const response = await fetch(`${API_BASE}/holidays`);
    if (!response.ok) throw new Error('Failed to fetch holidays');
    return response.json();
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
}

// Fetch special periods
export async function fetchSpecialPeriods(): Promise<SpecialPeriod[]> {
  try {
    const response = await fetch(`${API_BASE}/special-periods`);
    if (!response.ok) throw new Error('Failed to fetch special periods');
    return response.json();
  } catch (error) {
    console.error('Error fetching special periods:', error);
    throw error;
  }
}

// Fetch lesson data from Google Sheets
export async function fetchLessonData(subject: string, date: Date): Promise<LessonData | null> {
  try {
    const sheetName = SHEET_MAPPING[subject] || subject;
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari spreadsheet.');
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse<LessonData>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            console.error('Format data tidak sesuai atau sheet tidak ditemukan.');
            resolve(null);
            return;
          }

          // Generate multiple date formats to match
          const dateFormats = [
            format(date, 'dd/MM/yyyy'),
            format(date, 'd/M/yyyy'),
            format(date, 'dd-MM-yyyy'),
            format(date, 'yyyy-MM-dd'),
            format(date, 'd/MM/yyyy'),
            format(date, 'dd/M/yyyy'),
            format(date, 'd-M-yyyy'),
            format(date, 'dd MMM yyyy', { locale: id }),
            format(date, 'd MMM yyyy', { locale: id }),
            format(date, 'dd MMMM yyyy', { locale: id }),
            format(date, 'd MMMM yyyy', { locale: id }),
            format(date, 'M/d/yyyy'),
            format(date, 'MM/dd/yyyy'),
          ];

          const matchingRows = results.data.filter((row) => {
            const rowDate = row.Tanggal?.trim();
            if (!rowDate) return false;
            return dateFormats.includes(rowDate);
          });

          if (matchingRows.length > 0) {
            resolve(matchingRows[matchingRows.length - 1]);
          } else {
            console.warn('Tidak ada data pembelajaran untuk tanggal ini.');
            resolve(null);
          }
        },
        error: (err: any) => {
          console.error('Gagal memproses data CSV:', err.message);
          resolve(null);
        }
      });
    });
  } catch (error: any) {
    console.error('Error fetching lesson data:', error.message || 'Terjadi kesalahan');
    throw error;
  }
}
