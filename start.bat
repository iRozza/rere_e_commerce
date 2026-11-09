@echo off
title AVELUNE Atelier - eCommerce Server
echo ========================================================
echo   Starting AVELUNE Atelier eCommerce Store...
echo ========================================================
set ELECTRON_RUN_AS_NODE=1
set PORT=5000

:: Open default browser after 1.5 seconds in background
start /min cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

:: Start Node.js Server
"%~dp0node.cmd" "%~dp0server.js"

pause
