#!/bin/bash

# D1 Student Profile Customizer - Quick Install Script

echo "🎯 D1 Student Profile Customizer - Installation Helper"
echo "=================================================="
echo ""

# Get the current directory (should be the extension folder)
EXTENSION_DIR="$(pwd)"

echo "📁 Extension Location: $EXTENSION_DIR"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found in current directory"
    echo "   Make sure you're running this from the extension folder:"
    echo "   cd /Users/kgurinov/Documents/Coding/AACC/d1studentprofile/extension"
    exit 1
fi

echo "✅ Found manifest.json"

# Check if dist folder exists (build files)
if [ ! -d "dist" ]; then
    echo "⚠️  Dist folder not found - building extension..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please check for errors above."
        exit 1
    fi
else
    echo "✅ Found dist folder with compiled files"
fi

# List required files
echo ""
echo "📋 Extension Files Check:"
echo "   ✅ manifest.json - $([ -f "manifest.json" ] && echo "Found" || echo "Missing")"
echo "   ✅ dist/content.js - $([ -f "dist/content.js" ] && echo "Found" || echo "Missing")"
echo "   ✅ dist/background.js - $([ -f "dist/background.js" ] && echo "Found" || echo "Missing")"
echo "   ✅ popup/popup.html - $([ -f "popup/popup.html" ] && echo "Found" || echo "Missing")"
echo "   ✅ styles/content.css - $([ -f "styles/content.css" ] && echo "Found" || echo "Missing")"
echo "   ✅ icons/icon-128.svg - $([ -f "icons/icon-128.svg" ] && echo "Found" || echo "Missing")"

echo ""
echo "🚀 Installation Instructions:"
echo ""
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder: $EXTENSION_DIR"
echo "5. Extension will be loaded and ready to use!"
echo ""
echo "📍 To test:"
echo "   - Visit any DestinyOne Student Profile page"
echo "   - Custom Fields should move below Student Status automatically"
echo "   - Click the extension icon for manual controls"
echo ""
echo "🔍 Troubleshooting:"
echo "   - If extension doesn't load, check browser console (F12)"
echo "   - Look for errors starting with [D1-Customizer]"
echo "   - Make sure you're on a D1 Student Profile page"
echo ""

# Try to open Chrome extensions page (macOS)
if command -v open >/dev/null 2>&1; then
    read -p "📖 Open Chrome extensions page now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "chrome://extensions/"
        echo "✅ Opened chrome://extensions/ in your default browser"
    fi
fi

echo "🎉 Ready for installation!"