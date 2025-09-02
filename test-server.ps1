# Simple test script for the dev server
$Port = 5173

Write-Host "Testing dev server on port $Port..." -ForegroundColor Yellow

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 3
    Write-Host "✓ Server is responding (Status: $($response.StatusCode))" -ForegroundColor Green
    
    # Test key routes
    $routes = @("/", "/projects")
    foreach ($route in $routes) {
        try {
            $routeResponse = Invoke-WebRequest -Uri "http://localhost:$Port$route" -TimeoutSec 3
            Write-Host "✓ Route '$route' is accessible" -ForegroundColor Green
        } catch {
            Write-Host "✗ Route '$route' failed" -ForegroundColor Red
        }
    }
    
    Write-Host "`n🚀 Dev server is working! Visit: http://localhost:$Port" -ForegroundColor Green
    
} catch {
    Write-Host "✗ Server is not responding. Starting server..." -ForegroundColor Red
    Write-Host "Please run 'npm run dev' in another terminal or wait for it to start." -ForegroundColor Yellow
}