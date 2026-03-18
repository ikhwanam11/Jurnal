export const CONFIG = {
  DEADLINE_RAPORT: new Date(2026, 11, 18),
  SHEET_MAPPING: {
    'Bahasa Indonesia': 'Indo',
    'Matematika': 'mtk',
    'IPAS': 'IPAS',
    'Pendidikan Pancasila': 'PKN',
    'Seni Budaya': 'seni',
  },
  SCHOOL_NAME: 'UPT SDN 1 Padangrejo',
  TEACHER_NAME: 'Ikhwanudin Amri, S.I.P.',
  CLASS_NAME: 'Kelas 4',
  DEFAULT_MONTH: new Date(2026, 2, 1),
  YEARS: [2025, 2026, 2027],
};

export const DAY_NAMES: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
  0: 'Minggu'
};

export const DAY_HEADERS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
