#!/bin/bash
echo "Opening GPS Test Page in your default browser..."

# Determine the OS and open the file accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open gps_test.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open gps_test.html
else
    # Other OS
    echo "Could not automatically open the browser."
    echo "Please manually open the gps_test.html file in your browser."
fi

echo "If the browser doesn't open automatically, please manually open the gps_test.html file."
read -p "Press Enter to continue..."
