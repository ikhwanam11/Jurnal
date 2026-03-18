# Jurnal Mengajar - Redesigned Edition

Aplikasi Jurnal Mengajar yang telah dirancang ulang untuk dapat dijalankan di hosting pribadi Anda. ✨

## ✨ Fitur Utama

- 📅 **Kalender Interaktif** - Lihat jadwal mengajar dalam tampilan kalender bulanan
- 📊 **Tampilan Mingguan** - Lihat jadwal per hari dalam layout mingguan
- 📚 **Detail Pembelajaran** - Lihat materi, tujuan pembelajaran, aktivitas, dan soal
- 🎓 **Manajemen Data Lokal** - Semua data disimpan dalam file JSON lokal
- 🚀 **Berjalan di Hosting Pribadi** - Tidak tergantung pada Google Sheets atau Google AI Studio
- 💾 **Offline Ready** - Dapat berfungsi tanpa koneksi internet setelah data dimuat

## 🏗️ Arsitektur Baru

### Struktur Folder
```
src/
├── components/           # Komponen React terpisah
│   ├── Header.tsx
│   ├── Calendar.tsx
│   ├── WeeklySchedule.tsx
│   ├── Modal.tsx
│   ├── ViewToggle.tsx
│   ├── DayModalContent.tsx
│   ├── LessonModalContent.tsx
│   └── HolidayList.tsx
├── services/            # Service layer untuk data
│   └── dataService.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── config.ts
│   ├── classNames.ts
│   └── dateUtils.ts
├── data/                # Data files (JSON)
│   ├── schedule.json
│   ├── holidays.json
│   └── special-periods.json
├── App.tsx             # Main App component
└── main.tsx
server/
└── server.ts           # Express API server
```

### Perubahan Arsitektur

**Sebelumnya (Google AI Studio):**
```
- Monolithic App.tsx (700+ lines)
- Mengambil data dari Google Sheets API
- Hardcoded constants dan logic
- Terbatas pada Google AI Studio
```

**Sekarang (Hosting Pribadi):**
```
- Komponen terpisah dengan SoC (Separation of Concerns)
- Service layer untuk data fetching
- Data files dalam JSON lokal
- Express backend untuk API
- Dapat dijalankan di mana saja
```

## 🚀 Cara Menjalankan

### Development (Local Development)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server** (Frontend + Backend)
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

3. **Terminal akan menampilkan:**
   ```
   ✅ Server berjalan di http://localhost:5000
   📋 API Schedule: http://localhost:5000/api/schedule
   🎓 API Holidays: http://localhost:5000/api/holidays
   📌 API Special Periods: http://localhost:5000/api/special-periods
   ```

### Production (Build & Deploy)

1. **Build Frontend**
   ```bash
   npm run build
   ```
   Hasilnya ada di folder `dist/`

2. **Deploy ke Hosting**
   
   **Option A: Static Hosting (Vercel, Netlify, GitHub Pages)**
   - Upload folder `dist/` ke hosting
   - Catatan: Anda perlu server terpisah untuk API

   **Option B: Self-Hosted (Your Own Server/VPS)**
   
   Upload file-file berikut ke server:
   ```
   dist/                    # Frontend build files
   server/                  # Backend files
   src/data/               # Data files
   package.json
   ```
   
   Jalankan di server:
   ```bash
   npm install --production
   PORT=5000 node server/server.ts
   ```

3. **Setup Reverse Proxy (Nginx/Apache)**
   ```nginx
   # Nginx example
   server {
       listen 80;
       server_name jurnal.example.com;
       
       # Frontend
       location / {
           root /path/to/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000/api/;
       }
   }
   ```

## 📝 Mengelola Data

### Menambah/Mengubah Jadwal

Edit file `src/data/schedule.json`:
```json
{
  "1": ["Upacara", "PJOK", "IPAS", "Seni Budaya"],
  "2": ["Matematika", "IPAS", "Bahasa Indonesia"],
  ...
}
```

### Menambah/Mengubah Hari Libur

Edit file `src/data/holidays.json`:
```json
{
  "2026-01-01": "Tahun Baru 2026 Masehi",
  "2026-02-17": "Tahun Baru Imlek 2576 Kongzili",
  ...
}
```

### Menambah/Mengubah Periode Khusus

Edit file `src/data/special-periods.json`:
```json
[
  {
    "name": "PTS (Genap)",
    "start": "2026-04-06",
    "end": "2026-04-11",
    "message": "Penilaian Tengah Semester",
    "color": "bg-orange-100 text-orange-800 border-orange-200"
  },
  ...
]
```

### Menambah Data Pembelajaran (Lessons)

Untuk memberikan data pembelajaran per mata pelajaran per tanggal:

1. **Option 1: Database**
   Ubah file `server/server.ts` untuk connect ke database

2. **Option 2: Google Sheets** (seperti sebelumnya)
   Update `src/services/dataService.ts` untuk fetch dari Google Sheets

3. **Option 3: JSON Files**
   Buat file `src/data/lessons.json` dengan struktur:
   ```json
   [
     {
       "Tanggal": "2026-03-01",
       "Matapelajaran": "Matematika",
       "BAB": "1",
       "Pertemuan": "1",
       "Tujuan Pembelajaran (TP)": "...",
       ...
     }
   ]
   ```

## 🔧 Teknologi yang Digunakan

### Frontend
- React 19+
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- date-fns (date utilities)
- Lucide Icons

### Backend
- Express.js
- CORS (cross-origin requests)
- TypeScript

### Development
- Node.js 18+
- npm/yarn
- concurrently (run multiple tasks)
- tsx (TypeScript execution)

## 📦 Build & Deployment

### Development Commands
```bash
npm run dev:frontend    # Hanya frontend
npm run dev:server      # Hanya server
npm run dev             # Frontend + Server (recommended)
npm run lint            # Check TypeScript
```

### Production Commands
```bash
npm run build           # Build frontend
npm start              # Start server (after build)
```

## 🎨 Customization

### Mengubah Nama Sekolah/Guru
Edit `src/utils/config.ts`:
```typescript
export const CONFIG = {
  SCHOOL_NAME: 'UPT SDN 1 Padangrejo',
  TEACHER_NAME: 'Ikhwanudin Amri, S.I.P.',
  CLASS_NAME: 'Kelas 4',
  ...
};
```

### Mengubah Warna/Tema
Semua styling menggunakan Tailwind CSS. Edit class di komponen atau ubah `src/index.css`.

### Menambah Fitur Baru
1. Buat komponen baru di `src/components/`
2. Buat service jika butuh data baru
3. Update `src/App.tsx` untuk menggunakan komponen baru

## 🐛 Troubleshooting

**Q: Port 5000 sudah digunakan**
```bash
# Ubah di package.json atau jalankan:
PORT=8000 npm run dev:server
```

**Q: CORS error saat fetch data**
Pastikan backend sudah berjalan di port 5000. Check di:
http://localhost:5000/health

**Q: Data tidak terupdate**
- Cache browser: Bersihkan cache atau buka di mode private
- Restart server: Tekan Ctrl+C dan jalankan `npm run dev` lagi

## 📚 Dokumentasi Lebih Lanjut

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [date-fns](https://date-fns.org)

## 📄 Lisensi

Proyek ini dapat Anda gunakan untuk keperluan pribadi dan pendidikan.

## 🎯 Next Steps

1. **Buat database** untuk menyimpan data pembelajaran (gunakan SQLite, PostgreSQL, MySQL)
2. **Tambah authentication** jika ingin mengontrol akses
3. **Backup data** secara berkala
4. **Monitor server** dengan PM2 untuk production
5. **Setup SSL/HTTPS** dengan Let's Encrypt

---

**Status:** ✅ Siap untuk hosting pribadi  
**Terakhir diupdate:** March 2026  
**Version:** 0.0.1
