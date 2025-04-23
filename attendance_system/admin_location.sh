#!/bin/bash
echo "Opening Admin Location Setter in your default browser..."

# Determine the OS and open the file accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open admin_location_setter.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open admin_location_setter.html
else
    # Other OS
    echo "Could not automatically open the browser."
    echo "Please manually open the admin_location_setter.html file in your browser."
fi

echo "If the browser doesn't open automatically, please manually open the admin_location_setter.html file."
read -p "Press Enter to continue..."
