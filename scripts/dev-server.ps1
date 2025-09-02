# Development Server Management Script
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "status", "test")]
    [string]$Action = "status"
)

$ProjectPath = Split-Path -Parent $PSScriptRoot
$Port = 5173

function Get-DevServerProcess {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        return Get-Process -Id $connections[0].OwningProcess -ErrorAction SilentlyContinue
    }
    return $null
}

function Stop-DevServer {
    Write-Host "Checking for existing dev server on port $Port..." -ForegroundColor Yellow
    
    $process = Get-DevServerProcess
    if ($process) {
        Write-Host "Found dev server process (PID: $($process.Id)). Stopping..." -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
        Start-Sleep -Seconds 2
        Write-Host "Dev server stopped." -ForegroundColor Green
    } else {
        Write-Host "No dev server running on port $Port." -ForegroundColor Green
    }
}

function Start-DevServer {
    Write-Host "Starting dev server..." -ForegroundColor Yellow
    Set-Location $ProjectPath
    
    # Start the dev server in background
    $job = Start-Job -ScriptBlock {
        param($path)
        Set-Location $path
        npm run dev
    } -ArgumentList $ProjectPath
    
    # Wait a moment for server to start
    Start-Sleep -Seconds 3
    
    # Check if server is running
    $maxAttempts = 10
    $attempt = 0
    
    do {
        $attempt++
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 2 -ErrorAction Stop
            Write-Host "Dev server started successfully! Available at http://localhost:$Port" -ForegroundColor Green
            return $job
        } catch {
            if ($attempt -lt $maxAttempts) {
                Write-Host "Waiting for server to start... (attempt $attempt/$maxAttempts)" -ForegroundColor Yellow
                Start-Sleep -Seconds 2
            }
        }
    } while ($attempt -lt $maxAttempts)
    
    Write-Host "Failed to start dev server after $maxAttempts attempts." -ForegroundColor Red
    Stop-Job -Job $job -ErrorAction SilentlyContinue
    Remove-Job -Job $job -ErrorAction SilentlyContinue
    return $null
}

function Test-DevServer {
    Write-Host "Testing dev server..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 5
        Write-Host "✓ Server is responding (Status: $($response.StatusCode))" -ForegroundColor Green
        
        # Test specific routes
        $routes = @("/", "/projects", "/about", "/contact")
        foreach ($route in $routes) {
            try {
                $routeResponse = Invoke-WebRequest -Uri "http://localhost:$Port$route" -TimeoutSec 3
                Write-Host "✓ Route '$route' is accessible" -ForegroundColor Green
            } catch {
                Write-Host "✗ Route '$route' failed" -ForegroundColor Red
            }
        }
        
        Write-Host "`nDev server is running properly!" -ForegroundColor Green
        Write-Host "Visit: http://localhost:$Port" -ForegroundColor Cyan
        
    } catch {
        Write-Host "✗ Server is not responding" -ForegroundColor Red
        return $false
    }
    
    return $true
}

function Show-Status {
    $process = Get-DevServerProcess
    if ($process) {
        Write-Host "✓ Dev server is running (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "  Port: $Port" -ForegroundColor Cyan
        Write-Host "  URL: http://localhost:$Port" -ForegroundColor Cyan
        
        # Test if it's responding
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 2
            Write-Host "  Status: Responding (HTTP $($response.StatusCode))" -ForegroundColor Green
        } catch {
            Write-Host "  Status: Not responding" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ No dev server running on port $Port" -ForegroundColor Red
    }
}

# Main script logic
switch ($Action) {
    "start" {
        Stop-DevServer
        $job = Start-DevServer
        if ($job) {
            Write-Host "`nDev server job created. Use 'stop' action to terminate." -ForegroundColor Yellow
        }
    }
    "stop" {
        Stop-DevServer
    }
    "restart" {
        Stop-DevServer
        Start-Sleep -Seconds 1
        $job = Start-DevServer
        if ($job) {
            Write-Host "`nDev server restarted successfully!" -ForegroundColor Green
        }
    }
    "test" {
        if (-not (Test-DevServer)) {
            Write-Host "`nStarting dev server for testing..." -ForegroundColor Yellow
            $job = Start-DevServer
            if ($job) {
                Start-Sleep -Seconds 2
                Test-DevServer
            }
        }
    }
    "status" {
        Show-Status
    }
}