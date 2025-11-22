# 🖥️ Desktop App Guide

This guide shows you how to build and run Valdosta Medicine as a standalone desktop application.

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 16 or higher
- Git

### Step 1: Install Dependencies

```bash
# Install root dependencies (Electron)
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

### Step 2: Build Frontend (One Time)

```bash
cd frontend
npm run build
cd ..
```

### Step 3: Run the Desktop App

```bash
npm start
```

The app will open in a native window! 🎉

---

## 📦 Building Executables

Build standalone installers for different platforms:

### Build for Windows (.exe installer)
```bash
npm run build:win
```
Output: `release/Valdosta Medicine Setup 1.0.0.exe`

### Build for macOS (.dmg)
```bash
npm run build:mac
```
Output: `release/Valdosta Medicine-1.0.0.dmg`

### Build for Linux (.AppImage)
```bash
npm run build:linux
```
Output: `release/Valdosta Medicine-1.0.0.AppImage`

### Build for All Platforms
```bash
npm run build
```

**Note:** You can only build for your current platform unless you set up cross-compilation.

---

## 📁 Where to Find Built Apps

After building, find your installers in:
- `release/` folder (Windows: .exe, macOS: .dmg, Linux: .AppImage)

You can distribute these files to users - they don't need Node.js or anything else installed!

---

## 🎨 Customizing the App Icon

1. Create your icon files:
   - `icon.png` - 512x512 PNG
   - `icon.ico` - Windows icon
   - `icon.icns` - macOS icon

2. Place them in the `assets/` folder

3. Use online converters:
   - https://convertico.com/
   - https://cloudconvert.com/

4. Rebuild the app

---

## 🔧 How It Works

The desktop app bundles:
1. **Electron** - Creates the native window
2. **Backend** - Node.js/Express server (runs internally)
3. **Frontend** - React UI (displayed in the window)

Everything runs locally on the user's computer - no internet required after installation!

---

## 🗄️ Database Location

The SQLite database is stored in:
- **Development:** `backend/database.sqlite`
- **Production:** User's app data folder

To reset the database in development:
```bash
cd backend
npm run seed
cd ..
npm start
```

---

## 🐛 Troubleshooting

### App won't start
```bash
# Make sure frontend is built
cd frontend
npm run build
cd ..

# Try again
npm start
```

### Backend errors
```bash
# Check if backend dependencies are installed
cd backend
npm install
cd ..
```

### Port 3000 already in use
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Build errors
```bash
# Clean and rebuild
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm install
cd backend && npm install && cd ..
cd frontend && npm install && npm run build && cd ..
npm run build
```

---

## 🔄 Updating the App

After making code changes:

1. **Backend changes:**
   ```bash
   # Restart the app
   npm start
   ```

2. **Frontend changes:**
   ```bash
   cd frontend
   npm run build
   cd ..
   npm start
   ```

3. **Rebuild installer:**
   ```bash
   npm run build
   ```

---

## 📋 App Features

The desktop app includes:
- ✅ No installation of separate backend/frontend needed
- ✅ Works offline (no internet required)
- ✅ Native window (taskbar icon, minimize, maximize, close)
- ✅ Database stored locally
- ✅ File menu with standard options
- ✅ Developer tools (View → Toggle Developer Tools)
- ✅ Auto-updates (can be configured)

---

## 🎯 Development vs Production

### Development Mode
```bash
npm start
```
- Frontend runs from `http://localhost:5173` (Vite dev server)
- Backend runs on port 3000
- Hot reload enabled
- Developer tools available

### Production Build
```bash
npm run build
```
- Everything bundled into one installer
- Frontend served from `frontend/dist`
- Backend embedded in the app
- Optimized and minified

---

## 🚢 Distribution

To share your app with others:

1. **Build the installer:**
   ```bash
   npm run build:win  # or :mac or :linux
   ```

2. **Share the file from `release/` folder**

3. **Users just run the installer** - no technical knowledge needed!

---

## 🔐 Default Login

After first launch:
- Email: `admin@valdostamedicine.com`
- Password: `admin123`

**Important:** Change this password immediately in production!

---

## 📊 File Size

Expected installer sizes:
- Windows: ~100-150 MB
- macOS: ~120-180 MB
- Linux: ~110-160 MB

The size includes Node.js runtime, Chromium, and all dependencies.

---

## 🌟 Advantages of Desktop App

✅ No browser required
✅ Feels like a native application
✅ Works completely offline
✅ Easy to distribute
✅ Automatic updates (can be configured)
✅ Better performance than web app
✅ Access to native OS features
✅ No web server setup needed

---

## 🆚 Desktop App vs Web App

| Feature | Desktop App | Web App |
|---------|-------------|---------|
| Installation | One-time installer | None (browser) |
| Internet | Not required | Required |
| Updates | Manual or auto | Instant |
| Distribution | Download installer | Share URL |
| Performance | Better | Good |
| Setup | Simple for users | Need server |

Choose desktop app if:
- Users need offline access
- You want a native feel
- Simple distribution is important

Choose web app if:
- Need to access from anywhere
- Want instant updates
- Multiple users need access

---

Need help? Check the main README.md for additional documentation!
