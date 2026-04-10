#!/bin/bash

echo "Installing DevTools Pro Bundle..."
echo

npm install
if [ $? -ne 0 ]; then
    echo "Error: npm install failed!"
    exit 1
fi

echo
echo "Linking all tools..."
echo

npm link picomp
npm link fileren
npm link textrepl
npm link extman

echo
echo "========================================"
echo "        Installation Complete!"
echo "========================================"
echo
echo "All 4 tools installed:"
echo "  picomp  - Batch image compression"
echo "  fileren - Batch file renaming"
echo "  textrepl - Batch text replacement"
echo "  extman  - File extension conversion"
echo
echo "Try: picomp --help"
echo
