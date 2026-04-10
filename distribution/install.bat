@echo off
echo Installing piComp...
echo.

npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed!
    pause
    exit /b 1
)

echo.
npm link
if %errorlevel% neq 0 (
    echo Error: npm link failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo           Installation Complete!
echo ========================================
echo.
echo You can now use 'picomp' from any command prompt!
echo Try: picomp --help
echo.
pause
