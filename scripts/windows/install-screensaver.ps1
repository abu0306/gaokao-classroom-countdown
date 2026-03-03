param(
  [string]$ExePath = "",
  [string]$DistDir = ".\\dist",
  [int]$TimeoutSeconds = 300
)

if ([string]::IsNullOrWhiteSpace($ExePath)) {
  $autoExe = Get-ChildItem -Path $DistDir -Filter "*.exe" -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($null -eq $autoExe) {
    Write-Error "No exe found. Please provide -ExePath, for example: .\\dist\\GaokaoCountdown 1.0.0.exe"
    exit 1
  }
  $ExePath = $autoExe.FullName
}

if (-not (Test-Path $ExePath)) {
  Write-Error "Exe not found: $ExePath"
  exit 1
}

$fullExe = (Resolve-Path $ExePath).Path
$scrPath = [System.IO.Path]::ChangeExtension($fullExe, ".scr")

Copy-Item -Force $fullExe $scrPath

$desktopReg = "HKCU:\Control Panel\Desktop"
Set-ItemProperty -Path $desktopReg -Name SCRNSAVE.EXE -Value $scrPath
Set-ItemProperty -Path $desktopReg -Name ScreenSaveActive -Value "1"
Set-ItemProperty -Path $desktopReg -Name ScreenSaveTimeOut -Value ([string]$TimeoutSeconds)

Write-Host "Screen saver installed:" $scrPath
Write-Host "Timeout set to" $TimeoutSeconds "seconds"
Write-Host "You may need to sign out/in for policy refresh on managed PCs."
