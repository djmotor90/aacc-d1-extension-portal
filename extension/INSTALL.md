# D1 Student Profile Customizer - Installation Guide

## Quick Installation (Developer Mode)

### 1. Download the Extension
- Clone or download this repository to your computer
- Navigate to the `extension/` folder

### 2. Build the Extension (Required)
```bash
cd extension
npm install
npm run build
```

### 3. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right corner)
3. Click "Load unpacked" button
4. Select the entire `extension/` folder (not the dist folder)
5. The extension will appear in your extensions list

### 4. Verify Installation
1. Look for the D1 Customizer icon in your Chrome toolbar
2. Visit a DestinyOne Student Profile page
3. The Custom Fields section should automatically move below Student Status
4. Click the extension icon to see status and manual controls

## File Structure for Installation
Ensure your extension folder contains these files:
```
extension/
├── manifest.json          ✅ Required
├── dist/                  ✅ Required (created by npm run build)
│   ├── background.js
│   └── content.js
├── popup/                 ✅ Required
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── styles/                ✅ Required
│   └── content.css
├── icons/                 ✅ Required
│   └── icon-128.svg
└── [other files]          ℹ️  Optional
```

## Troubleshooting

### Extension Won't Load
- Make sure you ran `npm install` and `npm run build`
- Check that `dist/` folder contains compiled JavaScript files
- Verify `manifest.json` is present in the root extension folder

### Extension Loads but Doesn't Work
- Check browser console for errors (F12 → Console tab)
- Look for messages starting with `[D1-Customizer]`
- Verify you're on a DestinyOne Student Profile page

### Custom Fields Not Moving
- Open the extension popup to check status
- Look for "Custom Fields Found" and "Student Status Found" indicators
- Try the manual "Move Custom Fields" button in the popup

### Console Debugging
Open browser console (F12) and look for these log patterns:
```
[D1-Customizer] 🎯 D1 Profile Customizer initialized
[D1-Customizer] ✅ Confirmed we are on D1 Student Profile page
[D1-Customizer] 🔍 Analyzing D1 page structure...
[D1-Customizer] ✅ Found Custom Fields via #customFieldCollapse
[D1-Customizer] ✅ Found Student Status via select element
[D1-Customizer] 🎉 Successfully moved Custom Fields section!
```

## Updating the Extension

### Update Code
1. Pull latest changes from repository
2. Run `npm run build` to recompile
3. Click "Reload" button next to extension in `chrome://extensions/`

### For Development
Use watch mode for automatic recompilation:
```bash
npm run dev
```
Then reload the extension after each change.

## Uninstallation

1. Go to `chrome://extensions/`
2. Find "D1 Student Profile Customizer"
3. Click "Remove" button
4. Confirm removal

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Look for existing GitHub issues
3. Create a new issue with:
   - Chrome version
   - Extension version
   - Console error messages
   - DestinyOne page URL (remove sensitive info)

## Next Steps

After installation:
- Visit a DestinyOne Student Profile page to see the extension in action
- Use the popup interface for manual control and status monitoring
- Report any issues or suggestions for improvement

---

**Extension successfully installed!** 🎉  
Visit any DestinyOne Student Profile page to see Custom Fields automatically repositioned below Student Status.