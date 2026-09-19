@echo off
title Deploy OrderFlow Hub to Vercel
cd /d "C:\Users\aditya\.gemini\antigravity\scratch\order-inventory-manager"
cls
echo ================================================================
echo    🚀 DEPLOY ORDERFLOW TO VERCEL (100%% FREE)
echo ================================================================
echo.
echo  [Step 1] If this is your first time, your browser will open to
echo          log into your free Vercel account (or click Sign Up with GitHub/Email).
echo.
echo  [Step 2] In this window, press Enter for every question to accept defaults:
echo          - Set up and deploy? -> Press ENTER (Y)
echo          - Which scope?       -> Press ENTER
echo          - Link to existing?  -> Press ENTER (N)
echo          - Project name?      -> Press ENTER
echo          - In which directory?-> Press ENTER
echo.
echo  [Step 3] Once finished, Vercel will give you your live URL!
echo.
echo ================================================================
echo Starting Vercel deployment...
echo ================================================================
echo.
npx -y vercel
echo.
echo ================================================================
echo  If deployment finished, copy your .vercel.app link above!
echo ================================================================
echo.
pause
