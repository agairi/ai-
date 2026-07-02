@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在启动学习计划助手...
echo.

start "" "http://localhost:3000"
serve -l 3000 dist

pause
