# PaperCraft — Setup Guide
### AI Question Paper Formatter · 100% Free

---

## What You Need
- A computer with Node.js installed (free)
- A free Gemini API key (from Google — no credit card)
- Your domain/server (or just run locally)

**Total cost: ₹0 / $0 forever.**

---

## Step 1 — Get Your Free Gemini API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSy...`)

> Free tier: 15 requests/minute, 1 million tokens/day. More than enough for any school.

---

## Step 2 — Install Node.js (if not already)

Download from **https://nodejs.org** → choose the LTS version → install.

Verify it works by opening Terminal/Command Prompt and typing:
```
node --version
```
You should see something like `v20.x.x`

---

## Step 3 — Set Up the Project

Open Terminal/Command Prompt in the `papercarft` folder:

```bash
# Install all dependencies (one time only)
npm install
```

This installs: Express, Mammoth (reads .docx), pdf-parse (reads PDF), html-to-docx (exports Word), and the Gemini connector.

---

## Step 4 — Add Your API Key

1. In the `papercraft` folder, find the file `.env.example`
2. Make a copy and rename it to `.env`
3. Open `.env` and replace `your_gemini_api_key_here` with your actual key:

```
GROQ_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
PORT=3000
```

Save the file.

---

## Step 5 — Run the App

```bash
npm start
```

You'll see:
```
✅  PaperCraft is running → http://localhost:3000
    Gemini Key : ✓ Set
```

Open **http://localhost:3000** in your browser — done!

---

## Deploying to Your Own Domain

### Option A — VPS / Own Server (Recommended)

If you have a Linux server (DigitalOcean, AWS, Hostinger VPS, etc.):

```bash
# 1. Upload the papercraft folder to your server

# 2. Install PM2 (keeps app running forever)
npm install -g pm2

# 3. Start the app
pm2 start server.js --name papercraft
pm2 save
pm2 startup

# 4. Point your domain to port 3000 using Nginx:
```

**Nginx config** (`/etc/nginx/sites-available/papercraft`):
```nginx
server {
    listen 80;
    server_name yourschool.com;   # ← your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/papercraft /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

For HTTPS (free SSL):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourschool.com
```

---

### Option B — Railway (Free Cloud Hosting)

1. Go to **https://railway.app** → sign up free
2. Click "New Project" → "Deploy from GitHub"
3. Push your `papercraft` folder to a GitHub repo
4. In Railway dashboard → add environment variable: `GEMINI_API_KEY = your_key`
5. Railway gives you a free `.railway.app` URL — or connect your own domain

---

### Option C — Render (Free Cloud Hosting)

1. Go to **https://render.com** → sign up free
2. "New Web Service" → connect your GitHub repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add `GEMINI_API_KEY` in Environment variables
6. Free tier sleeps after inactivity — paid tier ($7/mo) for always-on

---

## Folder Structure

```
papercraft/
├── server.js          ← Main server (all API logic)
├── package.json       ← Dependencies list
├── .env               ← Your API key (DO NOT share this)
├── .env.example       ← Template for .env
├── public/
│   └── index.html     ← The entire frontend UI
└── README.md          ← This file
```

---

## How It Works

```
Teacher uploads .docx/.pdf
        ↓
Server extracts text with Mammoth / pdf-parse
        ↓
Teacher types new questions
        ↓
Server sends both to Gemini AI:
  "Keep exact same format, replace only the questions"
        ↓
Gemini returns formatted HTML
        ↓
Teacher downloads as Word (.docx) or prints to PDF
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `GEMINI_API_KEY not set` | Make sure `.env` file exists with your key |
| Port 3000 already in use | Change `PORT=4000` in `.env` |
| PDF text not extracting well | Try saving the PDF as .docx first in Word |
| Word download opens but looks plain | This is normal — it contains all the text. You can format further in Word |
| Gemini returns error 429 | You hit the free rate limit — wait 1 minute and try again |

---

## Need Help?

The app is simple by design — just 3 files. A developer can customize anything.

If you want to add features (user login, paper history, multiple templates), consider adding a database. Recommended free options:
- **Supabase** (free PostgreSQL) — https://supabase.com
- **MongoDB Atlas** (free) — https://mongodb.com/atlas

---

*Made with ❤️ for teachers. Zero cost, zero compromise.*
