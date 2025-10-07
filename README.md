# AACC D1 Student Profile Customizer# D1 Student Profile Reorder Extension



A private internal tool for Anne Arundel Community College to enhance the DestinyOne Student Information System workflow.This Chrome extension moves the Custom Fields section to appear at the top of the D1 Student Profile page, right after the student name information and before the Student Status section.



## 🎯 Project Overview## Features



This repository contains both the Chrome extension and web portal for distributing the D1 Student Profile Customizer to AACC staff members.- **Automatic Detection**: Automatically detects D1 Student Profile pages

- **Smart Positioning**: Moves Custom Fields section to the optimal location

### What it does:- **Visual Indicators**: Adds visual cues to show the section has been moved

- **Chrome Extension**: Automatically moves Custom Fields section below Student Status in D1 Student Profile pages- **Manual Control**: Popup interface for manual control

- **Web Portal**: Secure, password-protected distribution site with automatic updates from GitHub releases- **Reset Functionality**: Easy way to reset the layout



## 📁 Repository Structure## Installation



```### Option 1: Tampermonkey (Recommended - Easiest)

├── extension/          # Chrome Extension

│   ├── dist/          # Compiled JavaScript (production ready)1. Install [Tampermonkey extension](https://www.tampermonkey.net/) from Chrome Web Store

│   ├── src/           # TypeScript source code2. Click the Tampermonkey icon → "Create a new script"

│   ├── popup/         # Extension popup interface3. Replace the default template with content from `tampermonkey-d1-reorder.user.js`

│   └── manifest.json  # Extension configuration4. Save (Ctrl+S)

│5. Navigate to any D1 Student Profile page - it will work automatically!

├── website/           # AACC Portal Website

│   ├── index.html     # Main portal page### Option 2: Stylebot (CSS + Optional JS)

│   ├── styles.css     # AACC-branded styling

│   ├── script.js      # Portal functionality1. Install [Stylebot extension](https://stylebot.dev/) from Chrome Web Store

│   └── assets/        # Website resources2. Navigate to your D1 Student Profile page

```3. Click Stylebot icon → "Open Stylebot"

4. **CSS Tab**: Paste content from `stylebot-d1-reorder.css`

## 🔐 Security & Access5. **JS Tab** (optional, for better reliability): Paste content from `stylebot-d1-reorder.js`

6. Click "Save"

- **Private Repository**: Restricted to AACC authorized personnel

- **Portal Password**: `aacc2025` (configurable)### Option 3: Chrome Extension (Full Control)

- **HTTPS Only**: Secure distribution via GitHub Pages

- **Session Management**: 8-hour timeout for security1. Open Chrome and navigate to `chrome://extensions/`

2. Enable "Developer mode" in the top right

## 🚀 Quick Start3. Click "Load unpacked"

4. Select the folder containing these files

### For AACC Staff (Extension Users):5. The extension will be installed and ready to use

1. Visit the AACC Portal (URL will be provided after deployment)

2. Enter access code: `aacc2025`### Option 4: Manual Console Script

3. Download and install the latest extension

4. Extension works automatically on D1 Student Profile pages1. Copy the content of `d1-profile-reorder.js`

2. Open the D1 Student Profile page

### For AACC IT (Administrators):3. Open browser Developer Tools (F12)

1. Create new extension releases to distribute updates4. Go to Console tab

2. Upload extension zip files to GitHub releases5. Paste the script and press Enter

3. Portal automatically detects and offers updates to users

4. Monitor usage and support requests## How It Works



## 🛠 Development1. **Page Detection**: The script detects if you're on a D1 Student Profile page

2. **Element Location**: It finds the Custom Fields section (`#customFieldCollapse`)

### Extension Development:3. **Target Identification**: It locates the Student Status section as the insertion point

```bash4. **DOM Manipulation**: It moves the Custom Fields section to appear before Student Status

cd extension/5. **Visual Enhancement**: It adds styling and indicators to show the change

npm install

npm run build          # Compile TypeScript## Files Included

npm run dev            # Development mode with watching

```### Tampermonkey Version (Recommended)

- `tampermonkey-d1-reorder.user.js` - Complete Tampermonkey userscript

### Website Testing:

```bash### Stylebot Version  

cd website/- `stylebot-d1-reorder.css` - CSS for Stylebot

python3 test-server.py  # Local test server- `stylebot-d1-reorder.js` - Optional JavaScript for Stylebot

# Opens http://localhost:8080

# Password: aacc2025### Chrome Extension Version

```- `manifest.json` - Chrome extension manifest

- `d1-profile-reorder.js` - Main JavaScript functionality

## 📦 Creating Extension Releases- `d1-profile-reorder.css` - CSS styling and fallback positioning

- `popup.html` - Extension popup interface

1. **Build Extension**:- `popup.js` - Popup functionality

   ```bash

   cd extension/### Documentation

   npm run build- `README.md` - This documentation

   ```

## Usage

2. **Create Release**:

   ```bash### Automatic Mode

   git tag v1.0.11. Install the extension

   git push origin v1.0.12. Navigate to any D1 Student Profile page

   ```3. The Custom Fields section will automatically move to the top



3. **Upload Extension**:### Manual Mode

   - Go to GitHub Releases1. Click the extension icon in Chrome toolbar

   - Upload the extension folder as a zip file2. Click "Reorder Fields" button to manually trigger the move

   - Portal automatically detects new version3. Click "Reset Layout" to reload the page and reset positions



## 📋 Features## Troubleshooting



### Chrome Extension:### Custom Fields Section Not Moving

- ✅ Automatic Custom Fields positioning- Ensure you're on the correct D1 Student Profile page

- ✅ Visual indicators and styling  - Check browser console for error messages

- ✅ Popup interface for manual control- Try using the manual mode via the popup

- ✅ Error handling and logging

- ✅ Performance optimized### Page Layout Issues

- Click "Reset Layout" in the extension popup

### Web Portal:- Refresh the page

- ✅ Password protection (`aacc2025`)- Clear browser cache if needed

- ✅ GitHub integration for updates

- ✅ Professional AACC branding### Extension Not Working

- ✅ Mobile responsive design- Verify the extension is enabled in `chrome://extensions/`

- ✅ Installation instructions- Check that the page URL matches the extension's URL patterns

- ✅ Support and troubleshooting- Look for JavaScript errors in the browser console

- ✅ Real-time update notifications

## Customization

## 🆘 Support

### Change Position

### For Extension Issues:Edit the `moveCustomFields()` function in `d1-profile-reorder.js`:

- **IT Help Desk**: (410) 777-2800```javascript

- **Email**: support@aacc.edu// Find different target location

- **Portal**: Built-in FAQ and troubleshootingconst targetLocation = document.querySelector('your-target-selector');

```

### For Technical Issues:

- Create GitHub Issues in this repository### Modify Styling

- Contact AACC IT DepartmentEdit the CSS in `d1-profile-reorder.css` or the inline styles in the JavaScript:

- Review documentation in `/website/README.md````javascript

customFieldsSection.style.border = '1px solid #your-color';

## 📄 Documentation```



- **Portal Documentation**: [`website/README.md`](website/README.md)### Update URL Patterns

- **Deployment Guide**: [`website/DEPLOYMENT.md`](website/DEPLOYMENT.md)Edit `manifest.json` to match different URLs:

```json

## 🔄 Update Process"matches": [

  "*://your-domain.com/*",

1. **Automatic Detection**: Portal checks GitHub every 5 minutes  "*://*/your-path/*"

2. **User Notification**: Staff see update notifications on portal]

3. **One-Click Download**: Easy installation of new versions```

4. **Version Tracking**: Clear version information displayed

## Browser Compatibility

## ⚠️ Important Notes

- **Chrome**: Full support (recommended)

- **Internal Use Only**: This tool is restricted to AACC personnel- **Edge**: Should work with minor modifications to manifest

- **DestinyOne Specific**: Designed for AACC's D1 implementation- **Firefox**: Requires manifest v2 conversion

- **Chrome Required**: Extension works with Chrome/Edge browsers- **Safari**: Not supported (requires different extension format)

- **HTTPS Required**: Portal must be served over secure connection

## Security Notes

## 📊 Version History

- Extension only runs on specified D1 domains

- **v1.0.0**: Initial release with core functionality- No external network requests

- **Future**: Additional D1 enhancements as requested- No data collection or storage

- Only modifies page layout, not data

## 🤝 Contributing

## Support

For AACC IT Staff:

1. Create feature branch from `main`If you encounter issues:

2. Test changes thoroughly

3. Update documentation as needed1. Check the browser console for error messages

4. Create pull request for review2. Verify you're on the correct page type

5. Deploy after approval3. Try disabling other extensions that might conflict

4. Use the manual mode if automatic detection fails

---

## Version History

**Maintained by**: AACC IT Department  

**Contact**: support@aacc.edu  - **v1.0**: Initial release with automatic Custom Fields repositioning

**Last Updated**: October 2025
## License

This extension is provided as-is for internal use. Modify as needed for your specific requirements.