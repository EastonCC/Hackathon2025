# Troubleshooting Guide

## Quick Fix - Run Setup Script

### On Windows:
```
setup.bat
```

### On Mac/Linux:
```bash
./setup.sh
```

This will automatically install everything and set up the app.

---

## Common Issues

### Issue 1: "npm: command not found" or "node: command not found"

**Problem:** Node.js is not installed

**Solution:**
1. Download and install Node.js from https://nodejs.org/
2. Choose the LTS (Long Term Support) version
3. After installation, restart your terminal/command prompt
4. Verify: `node --version` and `npm --version`

---

### Issue 2: "Cannot find module" errors

**Problem:** Dependencies not installed

**Solution:**
```bash
# Install all dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### Issue 3: Desktop app starts but shows blank screen

**Problem:** Frontend not built

**Solution:**
```bash
cd frontend
npm run build
cd ..
npm start
```

---

### Issue 4: "Port 3000 already in use"

**Problem:** Another process is using port 3000

**Solution:**

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Or change the port in `backend/.env`:
```
PORT=3001
```

---

### Issue 5: Database errors or no data showing

**Problem:** Database not seeded

**Solution:**
```bash
cd backend
npm run seed
cd ..
npm start
```

---

### Issue 6: "ENOENT: no such file or directory"

**Problem:** Missing files or wrong directory

**Solution:**
```bash
# Make sure you're in the correct directory
cd /path/to/Hackathon2025

# Check if all folders exist
ls -la
# Should see: backend, frontend, assets, etc.

# Run setup script
./setup.sh  # or setup.bat on Windows
```

---

### Issue 7: Build fails with "electron-builder" errors

**Problem:** Build dependencies missing

**Solution:**
```bash
# Clean install
rm -rf node_modules
npm install

# Try building again
npm run build:win  # or :mac or :linux
```

---

### Issue 8: Frontend shows "Cannot connect to API"

**Problem:** Backend not running or wrong URL

**Solution:**

**For Desktop App:**
- Make sure backend is starting (check console logs)
- Backend should be on http://localhost:3000

**For Web App:**
- Check `frontend/.env.production` or `frontend/.env`
- Verify `VITE_API_URL` points to your backend

---

### Issue 9: Login doesn't work

**Problem:** Database not seeded or wrong credentials

**Solution:**
```bash
# Re-seed database
cd backend
npm run seed
cd ..

# Use these credentials:
# Email: admin@valdostamedicine.com
# Password: admin123
```

---

### Issue 10: App won't start after building

**Problem:** Various build issues

**Solution:**
```bash
# Complete clean rebuild
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf frontend/dist
rm -rf release
rm -rf out

# Reinstall everything
npm install
cd backend && npm install && cd ..
cd frontend && npm install && npm run build && cd ..

# Try again
npm start
```

---

## Still Having Issues?

### For Desktop App:

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v16 or higher
   ```

2. **Check logs:**
   - Look for error messages in the terminal
   - In the app, press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac) to open Developer Tools

3. **Start fresh:**
   ```bash
   git clone https://github.com/EastonCC/Hackathon2025.git
   cd Hackathon2025
   git checkout claude/employee-management-admin-01WacUd9V15UzDgUvQix5wWz
   ./setup.sh  # or setup.bat on Windows
   npm start
   ```

### For Web App:

See [QUICKSTART.md](QUICKSTART.md) for running locally or [DEPLOYMENT.md](DEPLOYMENT.md) for hosting online.

---

## Getting Help

If you're still stuck, provide:
1. What command you ran
2. The error message (full text)
3. Your operating system
4. Node.js version (`node --version`)
5. What you were trying to do

---

## Quick Reference

### Desktop App Commands:
```bash
./setup.sh              # Setup everything (Mac/Linux)
setup.bat               # Setup everything (Windows)
npm start               # Run the app
npm run build:win       # Build Windows installer
npm run build:mac       # Build Mac installer
npm run build:linux     # Build Linux installer
```

### Web App Commands:
```bash
# Backend
cd backend
npm install
npm run seed
npm start               # Runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev             # Runs on http://localhost:5173
```

### Docker Commands:
```bash
docker-compose up -d                        # Start
docker exec -it valdosta-backend npm run seed  # Seed DB
docker-compose logs backend                 # View logs
docker-compose down                         # Stop
```
