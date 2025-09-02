@echo off
echo Testing dev server...

curl -s -o nul -w "%%{http_code}" http://localhost:5173 > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="200" (
    echo ✓ Server is responding (Status: %status%)
    echo ✓ Testing projects page...
    curl -s -o nul -w "%%{http_code}" http://localhost:5173/projects > temp_projects.txt
    set /p projects_status=<temp_projects.txt
    del temp_projects.txt
    
    if "%projects_status%"=="200" (
        echo ✓ Projects page is accessible
        echo.
        echo 🚀 Dev server is working! Visit: http://localhost:5173
        echo 📁 Projects page: http://localhost:5173/projects
    ) else (
        echo ✗ Projects page failed (Status: %projects_status%)
    )
) else (
    echo ✗ Server is not responding
    echo Please make sure the dev server is running with 'npm run dev'
)