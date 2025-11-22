@echo off
echo.
echo Setting up Valdosta Medicine Desktop App...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first:
    echo https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found
node --version
echo.

REM Install root dependencies
echo Installing Electron...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install Electron dependencies
    pause
    exit /b 1
)
echo Electron installed
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed
echo.

REM Seed database
echo Creating database...
call npm run seed
if %errorlevel% neq 0 (
    echo Failed to seed database
    pause
    exit /b 1
)
echo Database created
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed
echo.

REM Build frontend
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Failed to build frontend
    pause
    exit /b 1
)
echo Frontend built
cd ..
echo.

echo Setup complete!
echo.
echo To run the desktop app:
echo   npm start
echo.
echo To build installers:
echo   npm run build:win   (Windows)
echo.
pause
