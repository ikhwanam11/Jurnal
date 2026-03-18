import { LessonData, SpecialPeriod, ScheduleData, HolidaysData } from '../types';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Load config from JSON file
const config = await fetch('/jurnal/config.json').then(r => r.json()).catch(() => ({
  api: {
    baseUrl: '/jurnal',
    sheetId: '1ODkiSNZfQ5Z78dcNu3cs3JHRtLGpy0pHn35LMxtDJz0',
    sheetMappings: {
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
      'Upacara': 'Upacara'
    }
  }
}));

const API_BASE = config.api.baseUrl;
const SPREADSHEET_ID = config.api.sheetId;
export const SHEET_MAPPING = config.api.sheetMappings;

// Static data for static deployment
const STATIC_DATA = {
  schedule: {
    "Senin": ["Bahasa Indonesia", "Matematika", "IPAS"],
    "Selasa": ["Pendidikan Pancasila", "Seni Budaya", "Bahasa Inggris"],
    "Rabu": ["Bahasa Lampung", "Pendidikan Agama", "PJOK"],
    "Kamis": ["Matematika", "IPAS", "Koding"],
    "Jumat": ["Bahasa Indonesia", "Upacara", "Seni Budaya"],
    "Sabtu": []
  },
  holidays: [
    { date: "2026-01-01", name: "Tahun Baru 2026", type: "holiday" },
    { date: "2026-02-17", name: "Tahun Baru Imlek", type: "holiday" },
    { date: "2026-03-12", name: "Hari Raya Nyepi", type: "holiday" },
    { date: "2026-03-29", name: "Wafat Isa Almasih", type: "holiday" },
    { date: "2026-04-02", name: "Idul Fitri 1447 H", type: "holiday" },
    { date: "2026-04-03", name: "Idul Fitri 1447 H +1", type: "holiday" },
    { date: "2026-04-04", name: "Idul Fitri 1447 H +2", type: "holiday" },
    { date: "2026-04-07", name: "Wafat Yesus Kristus", type: "holiday" },
    { date: "2026-05-01", name: "Hari Buruh Internasional", type: "holiday" },
    { date: "2026-05-12", name: "Kenaikan Isa Almasih", type: "holiday" },
    { date: "2026-05-29", name: "Kenaikan Nabi Muhammad SAW", type: "holiday" },
    { date: "2026-06-01", name: "Hari Lahir Pancasila", type: "holiday" },
    { date: "2026-06-17", name: "Idul Adha 1447 H", type: "holiday" },
    { date: "2026-07-07", name: "Tahun Baru Islam 1448 H", type: "holiday" },
    { date: "2026-08-17", name: "Hari Kemerdekaan RI", type: "holiday" },
    { date: "2026-09-05", name: "Maulid Nabi Muhammad SAW", type: "holiday" },
    { date: "2026-12-25", name: "Natal", type: "holiday" },
    { date: "2026-12-31", name: "Malam Tahun Baru", type: "holiday" }
  ],
  specialPeriods: [
    { start: "2026-04-02", end: "2026-04-04", name: "Libur Idul Fitri", type: "holiday" },
    { start: "2026-06-16", end: "2026-06-20", name: "Libur Idul Adha", type: "holiday" },
    { start: "2026-12-22", end: "2026-12-31", name: "Libur Natal & Tahun Baru", type: "holiday" }
  ]
};

// Fetch schedule data
export async function fetchSchedule(): Promise<ScheduleData> {
  return STATIC_DATA.schedule;
}

// Fetch holidays data
export async function fetchHolidays(): Promise<HolidaysData> {
  return STATIC_DATA.holidays;
}

// Fetch special periods data
export async function fetchSpecialPeriods(): Promise<SpecialPeriod[]> {
  return STATIC_DATA.specialPeriods;
}

// Fetch lesson data from Google Sheets
export async function fetchLessonData(subject: string, date: Date): Promise<LessonData | null> {
  try {
    const sheetName = SHEET_MAPPING[subject];
    if (!sheetName) {
      console.warn(`No sheet mapping found for subject: ${subject}`);
      return null;
    }

    // Try multiple date formats to match Google Sheets data
    const dateFormats = [
      format(date, 'yyyy-MM-dd'),
      format(date, 'dd/MM/yyyy'),
      format(date, 'MM/dd/yyyy'),
      format(date, 'yyyy/MM/dd'),
      format(date, 'dd-MM-yyyy'),
      format(date, 'MM-dd-yyyy'),
      format(date, 'd/M/yyyy'),
      format(date, 'M/d/yyyy'),
      format(date, 'yyyy-M-d'),
      format(date, 'd-M-yyyy'),
      format(date, 'M-d-yyyy'),
      format(date, 'yyyy/M/d'),
      format(date, 'd/M/yyyy')
    ];

    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];

          // Find matching date in any format
          for (const row of data) {
            const rowDateStr = row['Tanggal'] || row['Date'] || row['tanggal'] || row['date'];
            if (!rowDateStr) continue;

            // Check if any date format matches
            for (const dateFormat of dateFormats) {
              if (rowDateStr.includes(dateFormat) ||
                  dateFormat.includes(rowDateStr) ||
                  rowDateStr === format(date, 'd/M/yyyy') ||
                  rowDateStr === format(date, 'M/d/yyyy')) {

                const lessonData: LessonData = {
                  subject: subject,
                  date: date.toISOString().split('T')[0],
                  topic: row['Materi'] || row['Topic'] || row['materi'] || row['topic'] || 'Tidak ada materi',
                  objectives: row['Tujuan'] || row['Objectives'] || row['tujuan'] || row['objectives'] || 'Tidak ada tujuan',
                  activities: row['Kegiatan'] || row['Activities'] || row['kegiatan'] || row['activities'] || 'Tidak ada kegiatan',
                  assessment: row['Penilaian'] || row['Assessment'] || row['penilaian'] || row['assessment'] || 'Tidak ada penilaian',
                  notes: row['Catatan'] || row['Notes'] || row['catatan'] || row['notes'] || ''
                };

                resolve(lessonData);
                return;
              }
            }
          }

          // No matching date found
          resolve(null);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          resolve(null);
        }
      });
    });

  } catch (error) {
    console.error('Error fetching lesson data:', error);
    return null;
  }
}