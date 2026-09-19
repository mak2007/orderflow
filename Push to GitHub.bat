@echo off
title Push OrderFlow to GitHub
cd /d "C:\Users\aditya\.gemini\antigravity\scratch\order-inventory-manager"
cls
echo ================================================================
echo    🚀 Pushing OrderFlow to https://github.com/mak2007/orderflow
echo ================================================================
echo.
echo If a browser window pops up, click "Authorize Git" to allow the push.
echo.
git branch -M main
git push -u origin main
echo.
echo ================================================================
echo Done! Next: Go to https://vercel.com/new and click "Import"!
echo ================================================================
echo.
pause
