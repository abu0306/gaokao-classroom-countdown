@echo off
setlocal

REM Double-click friendly classroom uninstall entry
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0easy-uninstall.ps1"

if %errorlevel% neq 0 (
  echo.
  echo Uninstall failed. Please run as administrator if policy blocks scripts.
  pause
  exit /b %errorlevel%
)

echo.
echo Uninstall finished successfully.
pause
endlocal
