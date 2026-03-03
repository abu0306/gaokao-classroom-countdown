param(
  [string]$TaskName = "GaokaoDailyWallpaper"
)

$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($null -eq $task) {
  Write-Host "Task not found:" $TaskName
  exit 0
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Scheduled task removed:" $TaskName
