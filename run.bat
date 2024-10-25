@echo off
:: Navigate to the project directory
cd /d "D:\Programming\timetrek"

:: Start the Node.js server
start cmd /k "node server.js"

:: Wait for a moment to ensure the server starts
timeout /t 5 /nobreak > NUL

:: Open the application in the default web browser
start http://localhost:3000
