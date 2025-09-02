# Quick test script for development
Write-Host "🧪 Testing Portfolio Website..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Test main page
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3
    Write-Host "✓ Main page: OK ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Main page: FAILED" -ForegroundColor Red
    Write-Host "Please start the dev server with: npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test projects page
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/projects" -TimeoutSec 3
    Write-Host "✓ Projects page: OK ($($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Projects page: FAILED" -ForegroundColor Red
}

# Test other routes
$routes = @("/about", "/contact")
foreach ($route in $routes) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173$route" -TimeoutSec 3
        Write-Host "✓ $route page: OK ($($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "✗ $route page: FAILED" -ForegroundColor Red
    }
}

Write-Host "`n🚀 Test complete! Visit: http://localhost:5173" -ForegroundColor Green
Write-Host "📁 Projects Grid: http://localhost:5173/projects" -ForegroundColor Cyan