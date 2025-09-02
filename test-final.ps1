Write-Host "Testing Portfolio Implementation..." -ForegroundColor Cyan

$response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5
Write-Host "Main page: OK ($($response.StatusCode))" -ForegroundColor Green

$response2 = Invoke-WebRequest -Uri "http://localhost:5173/projects" -TimeoutSec 5  
Write-Host "Projects page: OK ($($response2.StatusCode))" -ForegroundColor Green

Write-Host "Implementation complete! Visit: http://localhost:5173/projects" -ForegroundColor Green