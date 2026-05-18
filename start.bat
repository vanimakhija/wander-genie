@echo off
title WanderGenie - AI Travel Planner

echo.
echo =============================================
echo    WanderGenie - AI Travel Planner
echo    Full Stack Startup
echo =============================================
echo.

:: ── Backend ───────────────────────────────────────────────────
echo [1/4] Setting up Python backend...
cd backend

if not exist "venv" (
    python -m venv venv
    echo   Virtual environment created.
)

call venv\Scripts\activate.bat
pip install -r requirements.txt -q
echo   Backend dependencies installed.

echo [2/4] Starting FastAPI backend on port 8000...
start "WanderGenie Backend" cmd /k "venv\Scripts\activate && uvicorn main:app --reload --port 8000"
echo   Backend started in new window.

timeout /t 3 /nobreak > nul
cd ..

:: ── Frontend ──────────────────────────────────────────────────
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install --silent
echo   Frontend dependencies installed.

echo [4/4] Starting Next.js frontend...
echo.
echo =============================================
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo =============================================
echo.

start "WanderGenie Frontend" cmd /k "npm run dev"

echo Both servers are starting...
echo Open http://localhost:3000 in your browser.
echo.
pause
