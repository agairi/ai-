@echo off
chcp 65001 >nul
title Study App Launcher
cd /d "%~dp0"

echo ========================================
echo    Study App Launcher
echo ========================================
echo.

:: Step 1: Check if server is running
echo [1/3] Checking server...
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo     Server is running.
    goto step3
)

:: Step 2: Start dev server
echo [2/3] Starting dev server...
start "" /B cmd /c "npm run dev > dev-server.log 2>&1"

:: Wait for server
set /a count=0
:waitloop
timeout /t 1 /nobreak >nul
set /a count+=1
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo     Server is ready! ^(took %count%s^)
    goto step3
)
if %count% lss 40 (
    echo     Waiting... %count%
    goto waitloop
)
echo.
echo [ERROR] Server failed to start in %count% seconds.
echo Check dev-server.log for details.
echo.
type dev-server.log
pause
exit /b 1

:: Step 3: Open browser in app mode
:step3
echo [3/3] Opening window...

set "EDGE="
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" set "EDGE=C:\Program Files\Microsoft\Edge\Application\msedge.exe"

set "CHROME="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

set "USERDATA=%TEMP%\study-app-browser"

if defined EDGE (
    echo     Using Edge.
    start "" "%EDGE%" --app=http://localhost:5173 --window-size=1280,820 --user-data-dir="%USERDATA%"
    goto done
)

if defined CHROME (
    echo     Using Chrome.
    start "" "%CHROME%" --app=http://localhost:5173 --window-size=1280,820 --user-data-dir="%USERDATA%"
    goto done
)

echo     Using default browser.
start "" http://localhost:5173

:done
echo.
echo Done! You can close this window.
timeout /t 3 /nobreak >nul
exit
