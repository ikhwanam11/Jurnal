# 🚀 DEPLOYMENT STATIC - JURNAL MENGAJAR

## ✅ STATUS: READY TO DEPLOY

Aplikasi ini sudah siap untuk deployment static hosting (shared hosting seperti Niagahoster).

## 📁 STRUKTUR FILE YANG DIPERLUKAN:

```
jurnal/
├── index.html          ← Entry point aplikasi
├── assets/             ← CSS, JS, images (hasil build)
├── .htaccess           ← Apache configuration
├── config.json         ← Konfigurasi aplikasi
└── README_DEPLOY.txt   ← File ini
```

## 🚀 CARA DEPLOYMENT:

### Step 1: Build Aplikasi
```bash
npm run build:static
```

### Step 2: Upload ke Server
- Upload file `jurnal-static.zip` ke server
- Extract ke folder `jurnal/`

### Step 3: Akses Aplikasi
```
http://your-domain.com/jurnal/
```

## ⚙️ KONFIGURASI:

### Google Sheets API
Edit file `config.json` untuk update sheet mappings:
```json
{
  "api": {
    "sheetMappings": {
      "Indo": "0",
      "mtk": "123456789",
      "IPAS": "987654321"
    }
  }
}
```

### Custom Domain/Subfolder
Jika deploy di subfolder selain `/jurnal/`, update:
- `.htaccess` → ganti `RewriteBase /jurnal/` dengan path baru
- `config.json` → update baseUrl jika perlu

## 🔧 TROUBLESHOOTING:

### ❌ 404 Error pada refresh
**Solusi:** Pastikan `.htaccess` aktif di server Apache

### ❌ Google Sheets tidak load
**Solusi:** Cek `config.json` - pastikan sheet ID benar

### ❌ Styling tidak muncul
**Solusi:** Pastikan folder `assets/` terupload lengkap

### ❌ Blank page
**Solusi:** Cek browser console untuk error JavaScript

## 📞 SUPPORT:

Jika ada masalah:
1. Cek browser console (F12)
2. Pastikan semua file terupload
3. Verifikasi `.htaccess` aktif
4. Test dengan incognito mode

## 📊 PERFORMANCE:

- ✅ Static hosting (fast loading)
- ✅ SEO friendly
- ✅ No server-side processing needed
- ✅ Compatible dengan shared hosting

---

**Happy Deploying!** 🎉