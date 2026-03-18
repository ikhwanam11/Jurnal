# 📦 Membuat Executable Standalone

Panduan membuat file `.exe` yang bisa dijalankan langsung **tanpa perlu npm install** di server.

## ✨ Keuntungan Executable

✅ **Satu file `.exe`** - Cukup upload 1 file  
✅ **Tidak perlu npm install** - Sudah include Node.js runtime  
✅ **Cepat startup** - Pre-compiled  
✅ **Mudah deployment** - Copy paste ke server  

---

## 🔧 Step 1: Install pkg (Lokal - di Komputer Kamu)

```bash
npm install --save-dev pkg
```

Ini sudah di-add ke devDependencies di `package.json`

---

## 🏗️ Step 2: Build Executable

Jalankan command ini di lokal (komputer kamu):

```bash
npm run build:exe
```

Ini akan:
1. ✅ Build frontend React ke folder `dist/`
2. ✅ Compile server TypeScript ke JavaScript
3. ✅ Bundle semuanya dengan pkg menjadi **`jurnal-server.exe`**

⏳ Proses ini memakan waktu 2-5 menit (tergantung kecepatan internet).

Setelah selesai, kamu akan lihat file:
```
jurnal-server.exe  (ukuran ~100-150 MB)
```

---

## 📤 Step 3: Upload `.exe` ke Server Niagahoster

### Option A: FTP Upload
1. Login ke **cPanel Niagahoster**
2. Buka **File Manager**
3. Navigate ke folder `public_html/` atau custom folder
4. Upload file `jurnal-server.exe`

### Option B: SSH Upload
```bash
scp jurnal-server.exe username@your-domain.com:/home/username/public_html/
```

---

## 🚀 Step 4: Jalankan di Server

### Via SSH Terminal

```bash
cd /home/username/public_html/
./jurnal-server.exe
```

Atau di Windows:
```bash
jurnal-server.exe
```

**Output:**
```
✅ Server berjalan di http://localhost:5000
📱 Frontend: http://localhost:5000
...
```

---

## 🔌 Step 5: Setup untuk Auto-Start (Optional)

### Agar server jalan otomatis saat server restart

**Di cPanel Niagahoster:**
1. Buka **Cron Jobs**
2. Buat script auto-start:

```bash
@reboot cd /home/username/public_html && nohup ./jurnal-server.exe > server.log 2>&1 &
```

Atau pakai **PM2** (jika Node.js tersedia di server):
```bash
npm install -g pm2
pm2 start jurnal-server.exe --name "jurnal"
pm2 startup
pm2 save
```

---

## 🌐 Akses Aplikasi

Setelah server berjalan:
- **Frontend:** `http://your-domain.com:5000`
- **API:** `http://your-domain.com:5000/api/schedule`

---

## 📝 Environment Variables

Jika kamu ingin custom port, buat file `.env` di server:

```env
PORT=3000
NODE_ENV=production
```

Jalankan:
```bash
PORT=3000 ./jurnal-server.exe
```

---

## ❌ Troubleshooting

### ❓ Error: "file not found"
**Solusi:** Pastikan struktur folder di server:
```
/app/jurnal/
├── jurnal-server.exe
├── dist/    ← hasil build frontend
└── src/data/   ← data files
```

### ❓ Port sudah digunakan
**Solusi:** Ganti port
```bash
PORT=8080 ./jurnal-server.exe
```

### ❓ Server tidak bisa diakses
**Solusi:** Cek firewall Niagahoster, minta support buka port atau gunakan port 80/443

---

## 📊 Perbandingan: Executable vs npm install

| Aspek | Executable (.exe) | npm install |
|-------|------------------|------------|
| **Ukuran file** | ~100-150 MB | ~500 MB+ |
| **Setup time** | Instant | 5-10 menit |
| **Node.js perlu** | ❌ Tidak | ✅ Perlu |
| **npm perlu** | ❌ Tidak | ✅ Perlu |
| **Dependency issues** | ❌ Tidak ada | ⚠️ Bisa |
| **Maintenance** | ✅ Lebih mudah | ⚠️ Lebih kompleks |

---

## 💡 Tips

- Build executable hanya perlu dilakukan **sekali** sebelum upload
- Setiap kali ada perubahan code, rebuild executable
- Executable sudah include semua dependencies dan Node.js
- Ukuran file besar karena include Node.js runtime (normal)

---

## 🔄 Workflow Update

Jika ada perubahan code:

1. **Update code** di lokal
2. **Build executable:**
   ```bash
   npm run build:exe
   ```
3. **Upload** file `.exe` baru ke server
4. **Restart** server

---

**Selesai! Aplikasi siap production-ready** 🚀
