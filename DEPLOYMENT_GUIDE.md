# Deployment Guide - Jurnal Mengajar

Panduan lengkap untuk mendeploy aplikasi Jurnal Mengajar ke hosting pribadi Anda.

## 🎯 Opsi Deployment

### Option 1: Shared Hosting (Rekomendasi untuk Pemula)

Hosting seperti: Hostinger, Domainesia, Niagahoster, dll yang support Node.js

**Steps:**
1. Upload project ke hosting via FTP/SSH
2. Install Node.js di hosting
3. Run: `npm install && npm run build`
4. Setup supervisor/PM2 untuk keep server running
5. Update DNS mengarah ke IP hosting

**Kelebihan:**
- Mudah setup
- Domain gratis/murah
- Support 24/7

**Kekurangan:**
- Performa terbatas
- Shared resources
- Update terbatas

---

### Option 2: VPS (Virtual Private Server)

Hosting seperti: DigitalOcean, Linode, Vultr, AWS, Google Cloud, dll

**Steps:**
1. Buat VPS Ubuntu/Debian minimal 1GB RAM
2. SSH ke server Anda
3. Clone repository:
   ```bash
   git clone <your-repo> /home/app/jurnal
   cd /home/app/jurnal
   ```

4. Install Node.js & npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

5. Install PM2 (process manager):
   ```bash
   sudo npm install -g pm2
   ```

6. Build aplikasi:
   ```bash
   npm install
   npm run build
   ```

7. Start dengan PM2:
   ```bash
   pm2 start server/server.ts --name "jurnal" --interpreter tsx
   pm2 startup
   pm2 save
   ```

8. Setup Nginx reverse proxy:
   ```bash
   sudo apt-get install nginx
   ```

   Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;

       server_name _;

       # Frontend
       location / {
           root /home/app/jurnal/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api/ {
           proxy_pass http://127.0.0.1:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

9. Setup SSL dengan Let's Encrypt:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

**Kelebihan:**
- Full kontrol
- Scalable
- Performa tinggi
- Resources dedicated

**Kekurangan:**
- Setup lebih kompleks
- Maintenance sendiri
- Biaya lebih mahal

---

### Option 3: Containerization (Docker)

Untuk deployment yang konsisten di berbagai environment.

**Buat Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "server/server.ts"]
```

**Build & Run:**
```bash
docker build -t jurnal:latest .
docker run -p 5000:5000 -v $(pwd)/src/data:/app/src/data jurnal:latest
```

**Push ke Docker Hub:**
```bash
docker tag jurnal:latest username/jurnal:latest
docker push username/jurnal:latest
```

---

## 📋 Checklist Pre-Deployment

- [ ] Test aplikasi di local (npm run dev)
- [ ] Update informasi di config.ts (sekolah, guru, kelas)
- [ ] Update data di JSON files (jadwal, libur, periode khusus)
- [ ] Build frontend: npm run build
- [ ] Test backend API endpoints
- [ ] Setup database jika butuh (untuk lesson data)
- [ ] Backup data files
- [ ] Setup monitoring/logging
- [ ] Setup SSL/HTTPS
- [ ] Setup backup otomatis

---

## 🔧 Konfigurasi Production

### Environment Variables (Production)

Buat `.env` file:
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...  # Jika pakai database
LOG_LEVEL=info
```

### Database Setup (Optional)

Untuk menyimpan data pembelajaran dinamis, setup database:

**PostgreSQL Example:**
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  bab VARCHAR(255),
  pertemuan VARCHAR(50),
  tujuan_pembelajaran TEXT,
  aktivitas_pembelajaran TEXT,
  halaman VARCHAR(100),
  materi TEXT,
  soal TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_subject_date ON lessons(subject, date);
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
# Check logs
pm2 logs jurnal

# Monitor resources
pm2 monit

# View all processes
pm2 list
```

### Nginx Logs
```bash
# Access log
tail -f /var/log/nginx/access.log

# Error log
tail -f /var/log/nginx/error.log
```

---

## 🚨 Troubleshooting

**Port sudah digunakan:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**PM2 tidak start otomatis:**
```bash
pm2 startup systemd -u $USER --hp /home/$USER
pm2 save
```

**Nginx error:**
```bash
sudo nginx -t  # Test config
sudo systemctl status nginx  # Check status
```

**Memory issue:**
```bash
# Check memory usage
free -h

# If needed, upgrade VPS or optimize code
# Add swap jika diperlukan
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📈 Scaling for Large Usage

Jika aplikasi digunakan banyak orang:

1. **Database**: Setup dedicated database server
2. **Caching**: Implementasi Redis untuk caching
3. **Load Balancing**: Gunakan nginx upstream untuk multiple server instances
4. **CDN**: Setup CDN untuk static files (frontend build)
5. **Monitoring**: Setup monitoring dengan Datadog, New Relic, atau Prometheus

---

## 🔐 Security Checklist

- [ ] Setup firewall (ufw untuk Ubuntu)
- [ ] Disable SSH password (gunakan key only)
- [ ] Setup fail2ban untuk brute force protection
- [ ] Update packages regularly: `sudo apt update && sudo apt upgrade`
- [ ] Backup data secara berkala
- [ ] Monitor logs untuk suspicious activity
- [ ] Setup DDoS protection
- [ ] Use strong passwords/API keys

---

## 📞 Support & Resources

- **Node.js Docs**: https://nodejs.org
- **Express Docs**: https://expressjs.com
- **Nginx Docs**: https://nginx.org
- **PM2 Docs**: https://pm2.keymetrics.io
- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tutorials

---

**Last Updated:** March 2026  
**Version:** 1.0
