param(
  [string]$AppExePath = "",
  [string]$WallpaperDir = ".\\wallpapers",
  [int]$ScreenSaverTimeoutSeconds = 300,
  [string]$WallpaperTaskTime = "06:00",
  [string]$WallpaperTimeZone = "China Standard Time"
)

$ErrorActionPreference = "Stop"

function Resolve-AppExe([string]$InputPath) {
  if (-not [string]::IsNullOrWhiteSpace($InputPath)) {
    if (-not (Test-Path $InputPath)) {
      throw "App exe not found: $InputPath"
    }
    return (Resolve-Path $InputPath).Path
  }

  $candidates = @()

  $scriptDir = Split-Path -Parent $PSCommandPath
  $projectRoot = Resolve-Path (Join-Path $scriptDir "..\\..")
  $distDir = Join-Path $projectRoot "dist"

  if (Test-Path $distDir) {
    $candidates += Get-ChildItem -Path $distDir -File -Filter "*.exe" -ErrorAction SilentlyContinue
  }

  $sameDir = Get-ChildItem -Path $scriptDir -File -Filter "*.exe" -ErrorAction SilentlyContinue
  if ($sameDir) {
    $candidates += $sameDir
  }

  $picked = $candidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($null -eq $picked) {
    throw "No application exe found automatically. Please pass -AppExePath."
  }

  return $picked.FullName
}

function Create-DesktopShortcut([string]$ExePath) {
  $desktop = [Environment]::GetFolderPath("Desktop")
  $shortcutPath = Join-Path $desktop "高考倒计时.lnk"

  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $ExePath
  $shortcut.WorkingDirectory = Split-Path -Parent $ExePath
  $shortcut.IconLocation = "$ExePath,0"
  $shortcut.Save()

  Write-Host "Desktop shortcut created:" $shortcutPath
}

$scriptDir = Split-Path -Parent $PSCommandPath
$installScreenSaverScript = Join-Path $scriptDir "install-screensaver.ps1"
$installWallpaperTaskScript = Join-Path $scriptDir "install-wallpaper-task.ps1"
$setWallpaperScript = Join-Path $scriptDir "set-desktop-wallpaper.ps1"

$appExe = Resolve-AppExe -InputPath $AppExePath
Write-Host "Using app exe:" $appExe

& $installScreenSaverScript -ExePath $appExe -TimeoutSeconds $ScreenSaverTimeoutSeconds

$wallpaperDirFull = ""
if (-not [string]::IsNullOrWhiteSpace($WallpaperDir)) {
  $candidateDir = $WallpaperDir
  if (-not (Test-Path $candidateDir)) {
    $candidateDir = Join-Path (Split-Path -Parent $appExe) "wallpapers"
  }

  if (Test-Path $candidateDir) {
    $wallpaperDirFull = (Resolve-Path $candidateDir).Path
    & $setWallpaperScript -ImagesDir $wallpaperDirFull -TimeZone $WallpaperTimeZone
    & $installWallpaperTaskScript -ImagesDir $wallpaperDirFull -RunAt $WallpaperTaskTime -TimeZone $WallpaperTimeZone
  } else {
    Write-Host "Wallpaper directory not found. Skipping auto wallpaper task."
    Write-Host "Tip: create a 'wallpapers' folder next to the exe and rerun this script."
  }
}

Create-DesktopShortcut -ExePath $appExe

Write-Host ""
Write-Host "Classroom mode setup complete."
Write-Host "- Screensaver installed"
if ($wallpaperDirFull) {
  Write-Host "- Daily wallpaper task installed from: $wallpaperDirFull"
} else {
  Write-Host "- Daily wallpaper task not installed (no wallpaper directory found)"
}
