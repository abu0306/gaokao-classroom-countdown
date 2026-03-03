param(
  [string]$TaskName = "GaokaoDailyWallpaper"
)

$ErrorActionPreference = "Stop"

function Remove-ScreenSaverRegistry {
  $desktopReg = "HKCU:\Control Panel\Desktop"

  Set-ItemProperty -Path $desktopReg -Name ScreenSaveActive -Value "0"
  Remove-ItemProperty -Path $desktopReg -Name SCRNSAVE.EXE -ErrorAction SilentlyContinue

  Write-Host "Screensaver registry disabled for current user."
}

function Remove-WallpaperTask([string]$Name) {
  $task = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
  if ($null -ne $task) {
    Unregister-ScheduledTask -TaskName $Name -Confirm:$false
    Write-Host "Removed scheduled task:" $Name
  } else {
    Write-Host "Scheduled task not found:" $Name
  }
}

function Remove-DesktopShortcut {
  $desktop = [Environment]::GetFolderPath("Desktop")
  $shortcutPath = Join-Path $desktop "高考倒计时.lnk"
  if (Test-Path $shortcutPath) {
    Remove-Item -Force $shortcutPath
    Write-Host "Removed desktop shortcut:" $shortcutPath
  } else {
    Write-Host "Desktop shortcut not found."
  }
}

Remove-ScreenSaverRegistry
Remove-WallpaperTask -Name $TaskName
Remove-DesktopShortcut

Write-Host ""
Write-Host "Classroom mode uninstall complete."
Write-Host "Note: app files are not deleted. Remove the app folder/installer separately if needed."
