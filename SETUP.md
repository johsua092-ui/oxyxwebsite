# OXYX API - Setup Guide

## 1. Setup Supabase (Backend/Database)

### Step 1: Buat Project Supabase
1. Buka **https://supabase.com** dan login/daftar
2. Klik **"New Project"**
3. Isi:
   - **Name**: `oxyx-api`
   - **Database Password**: (catat password ini)
   - **Region**: `Southeast Asia (Singapore)` biar deket
4. Tunggu project selesai dibuat (1-2 menit)

### Step 2: Buat Tabel Database
1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar kiri
2. Copy-paste SQL berikut lalu klik **"Run"**:

```sql
-- Tabel untuk log setiap API request
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET',
  status_code INTEGER NOT NULL DEFAULT 200,
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  user_agent TEXT DEFAULT 'unknown',
  ip_address TEXT DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel untuk statistik harian
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_requests INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  avg_response_ms NUMERIC DEFAULT 0
);

-- Index biar query cepat
CREATE INDEX IF NOT EXISTS idx_logs_created ON api_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_endpoint ON api_logs (endpoint);
CREATE INDEX IF NOT EXISTS idx_stats_date ON daily_stats (date DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Policy: anon bisa insert log (untuk API logging)
CREATE POLICY "anon_insert_logs" ON api_logs FOR INSERT TO anon WITH CHECK (true);

-- Policy: anon bisa baca semua (untuk dashboard)
CREATE POLICY "anon_read_logs" ON api_logs FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_stats" ON daily_stats FOR SELECT TO anon USING (true);
```

### Step 3: Ambil Credentials
1. Klik **"Settings"** > **"API"** di sidebar
2. Copy 2 value ini:
   - **Project URL** (contoh: `https://abcdef.supabase.co`)
   - **anon public key** (string panjang yang dimulai dengan `eyJ...`)

### Step 4: Pasang di Project
1. Buka file `.env.local` di folder project oxyx
2. Isi seperti ini:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdef.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Restart server: `npm run dev`
4. Sekarang setiap API request akan otomatis ter-log ke Supabase

---

## 2. Jalankan di Termux (HP Android)

### Persiapan Termux
```bash
# Update packages
pkg update && pkg upgrade -y

# Install Node.js
pkg install nodejs-lts git -y

# Cek versi
node -v
npm -v
```

### Clone dan Setup Project
```bash
# Clone repo
git clone https://github.com/johsua092-ui/oxyxapis.git
cd oxyxapis

# Install dependencies
npm install

# Buat file env
nano .env.local
# (isi NEXT_PUBLIC_SUPABASE_URL dan KEY, lalu Ctrl+X > Y > Enter)

# Build project (ini butuh waktu 2-5 menit di HP)
npm run build
```

### Jalankan Server
```bash
# Cara 1: Langsung (mati kalau Termux ditutup)
npm start

# Cara 2: Pakai PM2 (jalan di background, auto-restart)
npm install -g pm2
pm2 start npm --name oxyx -- start
pm2 save
pm2 startup  # biar auto-start pas HP restart
```

### Akses dari HP/Browser
- Buka browser di HP: **http://localhost:3000**
- Dari device lain di WiFi yang sama: **http://IP-HP:3000**
  - Cek IP HP: `ifconfig | grep inet`

### Monitoring via CLI (dari Termux)
```bash
# Masuk ke CLI maintenance tool
node cli/oxyx.mjs

# Commands yang bisa dipakai:
# health     - Cek server hidup atau mati
# stats      - Lihat statistik server
# watch      - Live monitoring (realtime)
# ping       - Test latency
# endpoints  - List semua API
# test /api/ai/luminai?content=hello  - Test endpoint
# request POST /api/ai/luminai {"content":"hello"}  - Custom request
# maint status  - Cek maintenance mode
# sysinfo    - Info sistem
# deploy     - Panduan deploy
```

### Tips Termux
- **Biar Termux ga di-kill Android**: Masuk Settings > Apps > Termux > Battery > Unrestricted
- **Notifikasi persistent**: `termux-wake-lock` (biar ga sleep)
- **Akses dari luar rumah**: Pakai ngrok atau cloudflare tunnel
  ```bash
  npm install -g ngrok
  ngrok http 3000
  ```

---

## 3. Deploy ke VPS (Atlantic Server)

Kalau nanti udah beli VPS:

```bash
# SSH ke VPS
ssh root@IP_VPS

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Clone repo
git clone https://github.com/johsua092-ui/oxyxapis.git
cd oxyxapis

# Setup
npm install
nano .env.local  # isi env vars

# Build & Run
npm run build
npm install -g pm2
pm2 start npm --name oxyx -- start
pm2 save
pm2 startup

# Setup Nginx (untuk domain)
apt install nginx -y
nano /etc/nginx/sites-available/oxyx
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.oxyx.my.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site & restart
ln -s /etc/nginx/sites-available/oxyx /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL (HTTPS) gratis
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.oxyx.my.id
```

Selesai! API bisa diakses di `https://api.oxyx.my.id`
