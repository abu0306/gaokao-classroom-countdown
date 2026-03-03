param(
  [Parameter(Mandatory = $true)]
  [string]$ImagesDir,
  [string]$TaskName = "GaokaoDailyWallpaper",
  [string]$RunAt = "06:00",
  [string]$TimeZone = "China Standard Time"
)

if (-not (Test-Path $ImagesDir)) {
  Write-Error "ImagesDir not found: $ImagesDir"
  exit 1
}

$scriptPath = Join-Path $PSScriptRoot "set-desktop-wallpaper.ps1"
if (-not (Test-Path $scriptPath)) {
  Write-Error "Missing script: $scriptPath"
  exit 1
}

$imagesFull = (Resolve-Path $ImagesDir).Path
$escapedScript = $scriptPath.Replace("'", "''")
$escapedImages = $imagesFull.Replace("'", "''")
$escapedZone = $TimeZone.Replace("'", "''")

$taskCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File '$escapedScript' -ImagesDir '$escapedImages' -TimeZone '$escapedZone'"

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -ImagesDir `"$imagesFull`" -TimeZone `"$TimeZone`""
$trigger = New-ScheduledTaskTrigger -Daily -At $RunAt

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Description "Set classroom wallpaper daily for gaokao countdown" -Force | Out-Null

Write-Host "Scheduled task installed:" $TaskName
Write-Host "Run time:" $RunAt
Write-Host "Command:" $taskCommand
