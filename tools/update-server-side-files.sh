#!/usr/bin/env sh

echo "Event and Notification Info..."
uglifyjs -m -c -o build/js/networkinfo.js js/networkinfo.js
echo "Banner..."
pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text image/event.png build/image/event.png

echo "Done."