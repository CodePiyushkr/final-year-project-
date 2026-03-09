@echo off
title AI Website Builder
cd /d "%~dp0"

echo.
echo ========================================
echo    AI WEBSITE BUILDER - Starting...
echo ========================================
echo.

:: Start Ollama if not running
echo [1/4] Starting Ollama AI...
start "" /B "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve 2>nul
timeout /t 2 /nobreak >nul
echo       Done!

:: Install backend if needed
echo [2/4] Checking Backend...
if not exist "server\node_modules" (
    echo       Installing dependencies...
    cd server
    call npm install >nul 2>&1
    cd ..
)
echo       Done!

:: Install frontend if needed
echo [3/4] Checking Frontend...
if not exist "client\node_modules" (
    echo       Installing dependencies...
    cd client
    call npm install >nul 2>&1
    cd ..
)
echo       Done!

:: Start servers
echo [4/4] Starting Servers...
echo.

:: Start backend
start "Backend" cmd /c "cd /d "%~dp0server" && node server.js"
timeout /t 2 /nobreak >nul

:: Start frontend
start "Frontend" cmd /c "cd /d "%~dp0client" && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    READY!
echo ========================================
echo.
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo    Opening browser...
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5173

echo Press any key to exit...
pause >nul
