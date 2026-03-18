# ✅ Update: Integrasi Google Sheets

Aplikasi telah diupdate untuk mengambil **data pembelajaran langsung dari Google Sheets Anda**.

## 📝 Perubahan Utama

### 1. **Data Pembelajaran dari Google Sheets** ✅
- Mata pelajaran sekarang fetch langsung dari spreadsheet
- URL Spreadsheet: https://docs.google.com/spreadsheets/d/1ODkiSNZfQ5Z78dcNu3cs3JHRtLGpy0pHn35LMxtDJz0
- Nama sheet disesuaikan dengan SHEET_MAPPING di `dataService.ts`

### 2. **Struktur Data**

#### a) **Data Statis** (JSON lokal - tetap sama)
```
src/data/
├── schedule.json           # Jadwal mata pelajaran per hari
├── holidays.json           # Hari libur nasional
└── special-periods.json    # Periode khusus (PTS, PAS, libur, dll)
```

#### b) **Data Dinamis** (dari Google Sheets)
- Pembelajaran (Materi, TP, Aktivitas, Soal, dll) → Fetch dari Sheets
- Diambil sesuai subject dan tanggal

### 3. **Sheet Mapping**

Edit di `src/services/dataService.ts`:
```typescript
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
```

**Instruksi:**
1. Cek nama sheet di spreadsheet Anda
2. Update mapping jika nama berbeda
3. Nama key adalah subject display, value adalah nama sheet di Sheets

### 4. **Dependencies Perubahan**

✅ Added:
- `papaparse` - Parse CSV dari Google Sheets
- `@types/papaparse` - TypeScript types

### 5. **Arsitektur Data Flow**

```
User Interface
    ↓
App.tsx (handleSubjectClick)
    ↓
dataService.fetchLessonData(subject, date)
    ↓
Google Sheets API (CSVviz export)
    ↓
Papa.parse (parse CSV)
    ↓
LessonData object
    ↓
LessonModalContent (display)
```

## 🚀 Cara Menjalankan

### Terminal 1 - Frontend
```bash
npm run dev:frontend
```
Akses: **http://localhost:5173**

### Terminal 2 - Backend
```bash
npm run dev:server
```
API: **http://localhost:5000**

### Atau Sekaligus
```bash
npm run dev
```

## ✨ Fitur

### ✅ Berjalan Dengan/Tanpa Backend
- **Dengan Backend**: Data statis (schedule, holidays) dari API, learning data dari Sheets
- **Tanpa Backend**: Learning data dari Sheets, fallback untuk data statis

### ✅ Mata Pelajaran Real-time
- Mata pelajaran sesuai dengan apa yang ada di spreadsheet
- Update spreadsheet → langsung reflect di aplikasi (setelah reload)

### ✅ Format Tanggal Fleksibel
Mendukung berbagai format tanggal di spreadsheet:
- `01/01/2026`, `1/1/2026`
- `01-01-2026`, `1-1-2026`
- `2026-01-01`
- `01 Jan 2026`, `1 Jan 2026`
- `01 Januari 2026`, `1 Januari 2026`
- `01/01/2026`, `01 Januari 2026`, dll

## 🔧 Update Spreadsheet

Struktur kolom spreadsheet (tidak berubah):
```
BAB | Pertemuan | Aktivitas Pembelajaran | Tujuan Pembelajaran (TP) | Halaman (BS/BG) | Tanggal | Materi | Soal
```

Contoh data untuk sheet "Indo":
```
1 | 1 | Membaca cerita | Siswa bisa membaca dengan lancar | 10-11 | 01/03/2026 | Cerita Si Kancil | Baca cerita hal 10
```

## 📊 Testing

1. **Buka aplikasi**: http://localhost:5173
2. **Klik kalender** - lihat jadwal
3. **Klik tanggal** - lihat mata pelajaran hari itu
4. **Klik mata pelajaran** - fetch data dari Google Sheets

### Debug Console
```javascript
// Buka Console (F12)
// Will show:
// - Loading status
// - Data fetch status
// - Error jika ada
```

## ⚙️ Troubleshooting

### Error: "Failed to fetch from Sheets"
**Solusi:**
- Spreadsheet harus public/shareable
- Pastikan sheet name ada di SHEET_MAPPING
- Check console (F12) untuk error detail

### Error: "Multiple exports with same name"
**Solusi:**
- Sudah di-fix di vite.config.ts
- Run: `npm install`

### Port already in use
**Solusi:**
```bash
# Ganti port di package.json atau
# Kill proses:
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux
taskkill /PID [PID] /F        # Windows
```

### Tidak ada data di modal pembelajaran
**Check:**
1. Spreadsheet public/accessible
2. Tanggal di Sheets sesuai format
3. Sheet name di SHEET_MAPPING benar
4. Check console (F12) untuk error

## 📚 File Yang Berubah

```
✅ src/services/dataService.ts    - Fetch dari Google Sheets
✅ src/App.tsx                     - Update handleSubjectClick
✅ package.json                    - Add papaparse & @types/papaparse
✅ Utils/config.ts                 - (no change needed)
```

## 🌐 Deployment

### Production Build
```bash
npm run build
npm start
```

Data akan tetap fetch dari Google Sheets di production.

## 📖 Referensi

- **Google Sheets Export URL**: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}`
- **Papa Parse Docs**: https://www.papaparse.com/
- **Date Format**: https://date-fns.org/

---

**Status**: ✅ **Ready to use dengan Google Sheets**  
**Tanggal Update**: March 18, 2026  
**Version**: 0.0.1
