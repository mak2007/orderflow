@echo off
title OrderFlow & Inventory Hub Launcher
cd /d "C:\Users\aditya\.gemini\antigravity\scratch\order-inventory-manager"

:: Check if port 3000 is listening
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo Starting OrderFlow local server...
    start /b "" node server.js
    timeout /t 1 /nobreak >nul
)

:: Open in default browser
echo Opening OrderFlow in default browser...
start "" "http://localhost:3000"
exit
