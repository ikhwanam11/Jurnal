# ✅ Checklist Upload ke Server

## 📦 Siap Upload Ke Server Production

Gunakan `.gitignore` untuk filter otomatis. File berikut akan **OTOMATIS DIABAIKAN**:

```
❌ node_modules/     (dependencies, akan di-install di server)
❌ dist/             (production build, akan di-generate di server)
❌ .env*             (environment variables, sensitive)
❌ .git/             (version control)
❌ coverage/         (test files)
❌ *.log             (log files)
```

## 📋 Cara Upload (Pilih Salah Satu):

### Option 1: Git Push (Rekomendasi)
```bash
git log --oneline -5  # Verify commit
git push origin main  # Push ke repository
# Di server: git clone <repo-url> && cd Jurnal
```

### Option 2: ZIP File
1. **Exclude** node_modules, dist, .env* sebelum zip
2. Atau gunakan `.gitignore.deploy`:
```bash
rsync -av --exclude-from=.gitignore \
  ./ user@server:/home/app/jurnal/
```

### Option 3: Manual Upload (FTP/SCP)
Pastikan upload **HANYA** folder/file ini:
```
✅ src/
✅ server/
✅ public/
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ vite.config.ts
✅ index.html
✅ .env.example
✅ .gitignore
✅ README*.md
```

**SKIP:**
```
❌ node_modules/
❌ dist/
❌ .env.local
❌ test-fetch.js
❌ metadata.json
```

## 🚀 Di Server: Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Build frontend (production)
npm run build

# 3. Start backend server
npm start
```

## 📂 Final Struktur Di Server:

```
/app/jurnal/
├── src/
├── server/
├── public/
├── dist/          ← auto-generated setelah npm run build
├── node_modules/  ← auto-generated setelah npm install
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## ⚙️ Environment Variables

1. **Copy** `.env.example` → `.env` di server:
```bash
cd /app/jurnal
cp .env.example .env
```

2. **Edit** `.env` dengan setting server:
```env
VITE_API_BASE=https://yourserver.com
VITE_API_PORT=5000
```

## ✨ Terakhir: Verifikasi

```bash
npm run lint      # Check TypeScript errors
npm run build     # Test production build
npm start         # Run server (port 5000)
```

**Selesai!** Server siap di akses di `http://yourserver.com` 🎉
