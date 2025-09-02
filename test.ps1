Write-Host "Testing Portfolio Website..." -ForegroundColor Cyan

$response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3
Write-Host "Main page: OK ($($response.StatusCode))" -ForegroundColor Green

$response2 = Invoke-WebRequest -Uri "http://localhost:5173/projects" -TimeoutSec 3  
Write-Host "Projects page: OK ($($response2.StatusCode))" -ForegroundColor Green

Write-Host "Test complete! Visit: http://localhost:5173/projects" -ForegroundColor Green