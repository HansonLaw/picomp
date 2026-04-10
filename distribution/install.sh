#!/bin/bash

echo "Installing piComp..."
echo

npm install
if [ $? -ne 0 ]; then
    echo "Error: npm install failed!"
    exit 1
fi

echo
npm link
if [ $? -ne 0 ]; then
    echo "Error: npm link failed!"
    exit 1
fi

echo
echo "========================================"
echo "         Installation Complete!"
echo "========================================"
echo
echo "You can now use 'picomp' from any terminal!"
echo "Try: picomp --help"
echo
