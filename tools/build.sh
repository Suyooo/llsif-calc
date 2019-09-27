#!/usr/bin/env sh

echo "Create empty build folder..."
rm -rf build
mkdir build

echo "Copy htaccess file..."
cp .htaccess build
echo "Copy fonts..."
cp --recursive fonts build
echo "Copy change log..."
cp changelog build
echo "Copy app manifest..."
cp manifest.json build

echo "Copy Libraries..."
mkdir build/vendor
for F in vendor/*.*; do
    echo "    ${F}"
    cp ${F} build/vendor
done

echo "Minify HTML..."
for F in *.html; do
    echo "    ${F}"
    node_modules/.bin/html-minifier --collapse-whitespace -o build/${F} ${F}
done

echo "Minify Javascript..."
mkdir build/js
for F in js/*.js; do
    echo "    ${F}"
    node_modules/.bin/uglifyjs --compress sequences=true,conditionals=true,booleans=true,dead_code=true,unused=true,if_return=true,join_vars=true --mangle -o build/${F} ${F}
done

echo "Minify CSS..."
mkdir build/css
for F in css/*.css; do
    echo "    ${F}"
    node_modules/.bin/purifycss ${F} index.html otasuke.html proedit.html js/ui.js js/common.js js/otasuke.js js/proedit.js js/materialize.js -m -o build/${F}
done

echo "Copy JPG images..."
mkdir build/image
cp image/*.jpg build/image

echo "Copy GIF images..."
cp image/*.gif build/image

echo "Crush PNG images..."
for F in image/*.png; do
    echo "    ${F}"
    pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text ${F} build/${F}
done

echo "Generate service worker..."
node_modules/.bin/uglifyjs --compress sequences=true,conditionals=true,booleans=true,if_return=true,join_vars=true --mangle -o build/serviceworker.js serviceworker.js
echo "" >> build/serviceworker.js
echo -n "var cache_files = new Set([" >> build/serviceworker.js
find build -not -path '*/\.*' -not -iname '.htaccess' -not -iname 'serviceworker.js' -not -iname 'networkinfo.js' -not -iname 'event_en.png' -not -iname 'event_jp.png' -type f -printf '"%P"\n' | tr '\n' ',' | sed 's/,$//' >> build/serviceworker.js
echo "]);" >> build/serviceworker.js
date "+// %Y/%m/%d %H:%M:%S" >> build/serviceworker.js

echo "Done."