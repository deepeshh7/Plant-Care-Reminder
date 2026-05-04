# 🔧 Cron Setup Checklist & Troubleshooting

## ✅ Required Files Checklist

### 1. Check if `scripts/dev-cron.js` exists
```bash
ls -la scripts/dev-cron.js
```
Should show the file. If not, create it.

### 2. Check if `package.json` has the script
```bash
grep "dev:cron" package.json
```
Should show: `"dev:cron": "node scripts/dev-cron.js"`

### 3. Check if cron API endpoint exists
```bash
ls -la app/api/cron/check-tasks/route.ts
```
Should exist. This is the endpoint the cron calls.

### 4. Check if CRON_SECRET is in .env
```bash
grep "CRON_SECRET" .env
```
Should show: `CRON_SECRET="some-long-string"`

### 5. Check if vercel.json exists
```bash
cat vercel.json | grep -A 5 "crons"
```
Should show cron configuration.

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module 'scripts/dev-cron.js'"
**Fix:** Create the scripts folder and file:
```bash
mkdir -p scripts
```
Then create `scripts/dev-cron.js` with the code.

### Issue 2: "Permission denied"
**Fix:** Make the script executable:
```bash
chmod +x scripts/dev-cron.js
```

### Issue 3: "Unauthorized" error
**Fix:** Check CRON_SECRET matches in both places:
1. In `.env` file
2. In `scripts/dev-cron.js` (default value)

### Issue 4: "Connection refused" or "ECONNREFUSED"
**Fix:** Make sure dev server is running:
```bash
# Terminal 1
pnpm dev
```

### Issue 5: Cron runs but "processedCount: 0"
**Fix:** No schedules are due. Create a schedule with time in the past or run:
```bash
pnpm run test:cron
```

### Issue 6: Cron runs but "notificationsSent: 0"
**Fix:** User doesn't have email notifications enabled. Run:
```bash
node scripts/enable-notifications.js
```

### Issue 7: "fetch is not defined" (Node < 18)
**Fix:** Update Node.js to version 18+ or install node-fetch:
```bash
npm install node-fetch
```

---

## 🧪 Step-by-Step Test

### Step 1: Verify All Files Exist
```bash
# Check cron script
cat scripts/dev-cron.js | head -5

# Check package.json
grep "dev:cron" package.json

# Check API endpoint
ls app/api/cron/check-tasks/route.ts

# Check .env
grep "CRON_SECRET" .env
```

### Step 2: Test Cron Endpoint Manually
```bash
# Get CRON_SECRET from .env
CRON_SECRET=$(grep CRON_SECRET .env | cut -d '=' -f2 | tr -d '"')

# Test the endpoint
curl -X GET http://localhost:3000/api/cron/check-tasks \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Expected response:**
```json
{
  "success": true,
  "processedCount": 0,
  "notificationsSent": 0,
  "timestamp": "..."
}
```

If you get `{"error": "Unauthorized"}`, the CRON_SECRET is wrong.

### Step 3: Run Dev Cron
```bash
pnpm run dev:cron
```

**Expected output:**
```
🌱 Plant Care - Development Cron Runner
=====================================
Checking for due tasks every 5 minutes...
API URL: http://localhost:3000
Press Ctrl+C to stop

[10:30:00 PM] ✅ Cron executed successfully
  - Processed: 0 schedule(s)
  - Notifications sent: 0
```

---

## 📋 Available Commands

### Development Commands
- `pnpm run dev:cron` - Run cron automatically every 5 minutes
- `pnpm run cron:now` - Trigger cron once immediately
- `pnpm run test:cron` - Create test data with overdue schedule

### Utility Scripts
- `node scripts/enable-notifications.js` - Enable email notifications for user
- `node scripts/check-user.js` - Check user's notification preferences

---

## 🎯 Quick Test Workflow

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Create test data:**
   ```bash
   pnpm run test:cron
   ```

3. **Trigger cron immediately:**
   ```bash
   pnpm run cron:now
   ```

4. **Check your email** (chandanbasavaraj88@gmail.com)

---

## 💡 What to Share for Help

If it's still not working, share:

1. **Error message** - Exact error you're seeing
2. **Node version** - Run: `node --version`
3. **File exists?** - Run: `ls -la scripts/dev-cron.js`
4. **Package.json** - Run: `grep "dev:cron" package.json`
5. **Cron secret** - Run: `grep "CRON_SECRET" .env` (first 10 chars only)
6. **Manual test** - Result of the curl command above
7. **User preferences** - Run: `node scripts/check-user.js`

This will help diagnose the exact issue!

---

## 🚀 Production Deployment

In production (Vercel), the cron runs automatically via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-tasks",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

No need to run `dev:cron` in production!
