@echo off
title Deploy OrderFlow to Vercel
cd /d "%~dp0"
cls
echo ================================================================
echo    🚀 DEPLOY ORDERFLOW TO VERCEL (100%% FREE)
echo ================================================================
echo.
echo  Step 1: A browser window will open to log into Vercel (or create a free account).
echo  Step 2: Follow the prompts in this window (Press Enter to accept defaults).
echo  Step 3: You will receive your live https://...vercel.app URL!
echo.
echo ================================================================
echo.
npx vercel
echo.
echo ================================================================
echo If deploy succeeded, your app is now LIVE on Vercel!
echo ================================================================
pause
