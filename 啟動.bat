@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===================================================
echo 正在啟動 photo 官方網站...
echo 本地網址: http://localhost:3001
===================================================
start http://localhost:3001
node server.js
pause
