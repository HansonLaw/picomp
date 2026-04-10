@echo off
echo Installing DevTools Pro Bundle...
echo.

call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed!
    pause
    exit /b 1
)

echo.
echo Linking all tools...
echo.

call npm link picomp
call npm link fileren
call npm link textrepl
call npm link extman

echo.
echo ========================================
echo        Installation Complete!
echo ========================================
echo.
echo All 4 tools installed:
echo   picomp  - Batch image compression
echo   fileren - Batch file renaming
echo   textrepl - Batch text replacement
echo   extman  - File extension conversion
echo.
echo Try: picomp --help
echo.
pause
