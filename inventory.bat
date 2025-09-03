@REM @echo off
@REM cls

@REM echo Starting Node.js Serial Server...

:: Start the Node.js server in a new Command Prompt window (non-blocking)
@REM start cmd /k "node ./app.js"
start cmd /k "npm run dev"

:: Wait a second to let the server start
@REM timeout /t 2 >nul

:: Open Chrome to localhost:3000
@REM start chrome http://localhost:3000

:: Optional pause (if you want this script window to remain)
@REM pause
