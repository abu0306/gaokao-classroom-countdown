@echo off
setlocal

REM Double-click friendly classroom setup entry
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0easy-install.ps1"

if %errorlevel% neq 0 (
  echo.
  echo Setup failed. Please run this file as administrator if policy blocks scripts.
  pause
  exit /b %errorlevel%
)

echo.
echo Setup finished successfully.
pause
endlocal
