@echo off
echo ========================================================
echo   Launching AVELUNE Atelier eCommerce Store...
echo ========================================================
set ELECTRON_RUN_AS_NODE=1
call "%~dp0node.cmd" "%~dp0server.js"
pause

