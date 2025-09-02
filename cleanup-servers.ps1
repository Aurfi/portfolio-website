# Clean up multiple dev servers
Write-Host "Cleaning up dev servers..." -ForegroundColor Yellow

$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) node processes. Stopping them..." -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object { 
        try {
            Stop-Process -Id $_.Id -Force
            Write-Host "Stopped PID: $($_.Id)" -ForegroundColor Green
        } catch {
            Write-Host "Could not stop PID: $($_.Id)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No node processes found." -ForegroundColor Green
}

Write-Host "Cleanup complete. You can now run 'npm run dev' safely." -ForegroundColor Green