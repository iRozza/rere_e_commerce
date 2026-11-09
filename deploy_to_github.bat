@echo off
title Push to GitHub (iRozza)
echo ========================================================
echo   Pushing AVELUNE to GitHub as iRozza...
echo ========================================================
echo.
echo If a browser window opens, click "Sign in with your browser"
echo to authorize as iRozza.
echo.

git remote set-url origin https://iRozza@github.com/iRozza/rere_e_commerce.git
git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   [SUCCESS] Code pushed to GitHub!
    echo.
    echo   Your website will be live in 1-2 minutes at:
    echo   https://irozza.github.io/rere_e_commerce/
    echo ========================================================
) else (
    echo ========================================================
    echo   Push encountered an issue. See message above.
    echo ========================================================
)
pause
