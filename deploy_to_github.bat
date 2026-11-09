@echo off
echo ========================================================
echo   Pushing AVELUNE to GitHub (iRozza)
echo ========================================================
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/iRozza/rere_e_commerce.git
echo Pushing to https://github.com/iRozza/rere_e_commerce.git...
git push -u origin main
echo.
echo If the push succeeded, your site will be live at:
echo https://irozza.github.io/rere_e_commerce/
echo ========================================================
pause
