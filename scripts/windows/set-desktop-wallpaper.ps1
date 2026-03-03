param(
  [string]$ImagePath = "",
  [string]$ImagesDir = "",
  [string]$TimeZone = "China Standard Time"
)

if ([string]::IsNullOrWhiteSpace($ImagePath) -and [string]::IsNullOrWhiteSpace($ImagesDir)) {
  Write-Error "Please provide -ImagePath or -ImagesDir"
  exit 1
}

function Get-DayKey([string]$TimeZoneId) {
  $tz = [System.TimeZoneInfo]::FindSystemTimeZoneById($TimeZoneId)
  $localNow = [DateTimeOffset]::Now
  $targetNow = [System.TimeZoneInfo]::ConvertTime($localNow, $tz)
  return $targetNow.ToString("yyyy-MM-dd")
}

function Get-Hash([string]$Text, [int]$Salt = 0) {
  $hash = [uint32]$Salt
  foreach ($c in $Text.ToCharArray()) {
    $hash = ([uint32](($hash * 31) + [int][char]$c))
  }
  return [int]$hash
}

$resolvedPath = ""

if (-not [string]::IsNullOrWhiteSpace($ImagesDir)) {
  if (-not (Test-Path $ImagesDir)) {
    Write-Error "ImagesDir not found: $ImagesDir"
    exit 1
  }

  $files = Get-ChildItem -Path $ImagesDir -File | Where-Object { $_.Extension -in ".jpg", ".jpeg", ".png", ".bmp" }
  if ($files.Count -eq 0) {
    Write-Error "No image files found in: $ImagesDir"
    exit 1
  }

  $sorted = $files | Sort-Object Name
  $key = Get-DayKey -TimeZoneId $TimeZone
  $index = (Get-Hash -Text $key -Salt 31) % $sorted.Count
  $resolvedPath = $sorted[$index].FullName
} else {
  if (-not (Test-Path $ImagePath)) {
    Write-Error "Image not found: $ImagePath"
    exit 1
  }
  $resolvedPath = (Resolve-Path $ImagePath).Path
}

Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name Wallpaper -Value $resolvedPath
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name WallpaperStyle -Value "10"
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name TileWallpaper -Value "0"

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class NativeMethods {
  [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
  public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@

[void][NativeMethods]::SystemParametersInfo(20, 0, $resolvedPath, 3)
Write-Host "Desktop wallpaper updated:" $resolvedPath
