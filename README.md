# AACC D1 Student Profile Customizer# AACC D1 Student Profile Customizer# AACC D1 Student Profile Customizer# AACC D1 Student Profile Customizer# D1 Student Profile Reorder Extension



An official internal tool for Anne Arundel Community College to enhance the DestinyOne Student Information System workflow.



## 🎯 Project OverviewAn official internal tool for Anne Arundel Community College to enhance the DestinyOne Student Information System workflow.



This Chrome extension automatically moves the Custom Fields section below the Student Status section in D1 Student Profile pages, improving workflow efficiency for AACC staff members.



This repository contains both the Chrome extension and secure web portal for distributing the D1 Student Profile Customizer to authorized AACC personnel.## 🎯 Project OverviewA private internal tool for Anne Arundel Community College to enhance the DestinyOne Student Information System workflow.



### What it does:

- **Automatic Detection**: Automatically detects D1 Student Profile pages

- **Smart Positioning**: Moves Custom Fields section below Student StatusThis Chrome extension automatically moves the Custom Fields section below the Student Status section in D1 Student Profile pages, improving workflow efficiency for AACC staff members.

- **Clean Interface**: Simple toggle switch for enable/disable

- **AACC Branding**: Official Anne Arundel Community College styling



## 📁 Repository StructureThis repository contains both the Chrome extension and secure web portal for distributing the D1 Student Profile Customizer to authorized AACC personnel.## 🎯 Project OverviewA private internal tool for Anne Arundel Community College to enhance the DestinyOne Student Information System workflow.This Chrome extension moves the Custom Fields section to appear at the top of the D1 Student Profile page, right after the student name information and before the Student Status section.



```

├── extension/          # Chrome Extension

│   ├── dist/          # Compiled JavaScript (production ready)### What it does:

│   ├── src/           # TypeScript source code

│   ├── popup/         # Extension popup interface- **Automatic Detection**: Automatically detects D1 Student Profile pages

│   ├── icons/         # AACC branded icons

│   └── manifest.json  # Extension configuration- **Smart Positioning**: Moves Custom Fields section below Student StatusThis repository contains both the Chrome extension and web portal for distributing the D1 Student Profile Customizer to AACC staff members.

├── docs/              # AACC Portal Website (GitHub Pages)

│   ├── index.html     # Main portal page- **Clean Interface**: Simple toggle switch for enable/disable

│   ├── styles.css     # AACC-branded styling

│   ├── script.js      # Portal functionality- **AACC Branding**: Official Anne Arundel Community College styling

│   └── aacc-logo.svg  # Official AACC logo

└── website/           # Development version

```

## 📁 Repository Structure### What it does:## 🎯 Project Overview## Features

## 🔐 Security & Access



- **Private Repository**: Restricted to AACC authorized personnel

- **Password Protection**: Secure access code required (contact AACC IT)```- **Chrome Extension**: Automatically moves Custom Fields section below Student Status in D1 Student Profile pages

- **HTTPS Only**: Secure distribution via GitHub Pages

- **Session Management**: Automatic timeout for security├── extension/          # Chrome Extension



## 🚀 Quick Start│   ├── dist/          # Compiled JavaScript (production ready)- **Web Portal**: Secure, password-protected distribution site with automatic updates from GitHub releases



### For AACC Staff (Extension Users):│   ├── src/           # TypeScript source code

1. Visit the AACC Portal (URL provided by AACC IT)

2. Enter the access code (provided by AACC IT)│   ├── popup/         # Extension popup interface

3. Download and install the latest extension

4. Extension works automatically on D1 Student Profile pages│   ├── icons/         # AACC branded icons



### For AACC IT (Administrators):│   └── manifest.json  # Extension configuration## 📁 Repository StructureThis repository contains both the Chrome extension and web portal for distributing the D1 Student Profile Customizer to AACC staff members.- **Automatic Detection**: Automatically detects D1 Student Profile pages

1. Create new extension releases to distribute updates

2. Upload extension zip files to GitHub releases├── docs/              # AACC Portal Website (GitHub Pages)

3. Portal automatically detects and offers updates to users

4. Monitor usage and support requests│   ├── index.html     # Main portal page



## 🛠 Development│   ├── styles.css     # AACC-branded styling



### Extension Development:│   ├── script.js      # Portal functionality```- **Smart Positioning**: Moves Custom Fields section to the optimal location

```bash

cd extension/│   └── aacc-logo.svg  # Official AACC logo

npm install

npm run build          # Compile TypeScript└── website/           # Development version├── extension/          # Chrome Extension

npm run dev            # Development mode with watching

``````



### Website Testing:│   ├── dist/          # Compiled JavaScript (production ready)### What it does:- **Visual Indicators**: Adds visual cues to show the section has been moved

```bash

cd docs/## 🔐 Security & Access

python3 test-server.py  # Local test server

# Opens http://localhost:8080│   ├── src/           # TypeScript source code

```

- **Private Repository**: Restricted to AACC authorized personnel

## 📦 Creating Extension Releases

- **Password Protection**: Secure access code required (contact AACC IT)│   ├── popup/         # Extension popup interface- **Chrome Extension**: Automatically moves Custom Fields section below Student Status in D1 Student Profile pages- **Manual Control**: Popup interface for manual control

1. **Build Extension**:

   ```bash- **HTTPS Only**: Secure distribution via GitHub Pages

   cd extension/

   npm run build- **Session Management**: Automatic timeout for security│   └── manifest.json  # Extension configuration

   ```



2. **Create Release**:

   ```bash## 🚀 Quick Start│- **Web Portal**: Secure, password-protected distribution site with automatic updates from GitHub releases- **Reset Functionality**: Easy way to reset the layout

   git tag v1.2.0

   git push origin v1.2.0

   ```

### For AACC Staff (Extension Users):├── website/           # AACC Portal Website (development)

3. **Upload Extension**:

   - Go to GitHub Releases1. Visit the AACC Portal (URL provided by AACC IT)

   - Upload the extension folder as a zip file

   - Portal automatically detects new version2. Enter the access code (provided by AACC IT)├── docs/              # AACC Portal Website (GitHub Pages)



## 🌐 Live Portal3. Download and install the latest extension



- **URL**: [https://djmotor90.github.io/aacc-d1-extension-portal/](https://djmotor90.github.io/aacc-d1-extension-portal/)4. Extension works automatically on D1 Student Profile pages│   ├── index.html     # Main portal page

- **Access**: Secure (contact AACC IT for credentials)

- **Status**: ✅ Production Ready

- **Updates**: Automatic from GitHub releases

### For AACC IT (Administrators):│   ├── styles.css     # AACC-branded styling## 📁 Repository Structure## Installation

## 📋 Features

1. Create new extension releases to distribute updates

### Chrome Extension:

- ✅ Automatic Custom Fields positioning2. Upload extension zip files to GitHub releases│   ├── script.js      # Portal functionality

- ✅ AACC official branding and colors

- ✅ Simple toggle interface for control3. Portal automatically detects and offers updates to users

- ✅ Error handling and logging

- ✅ Performance optimized4. Monitor usage and support requests│   └── assets/        # Website resources



### Web Portal:

- ✅ Password protection for security

- ✅ GitHub integration for updates## 🛠 Development```

- ✅ Professional AACC branding

- ✅ Mobile responsive design

- ✅ Installation instructions

- ✅ Support and troubleshooting### Extension Development:```### Option 1: Tampermonkey (Recommended - Easiest)

- ✅ Real-time update notifications

```bash

## 🆘 Support

cd extension/## 🔐 Security & Access

### For Extension Issues:

- **IT Help Desk**: (410) 777-2800npm install

- **Email**: support@aacc.edu

- **Portal**: Built-in FAQ and troubleshootingnpm run build          # Compile TypeScript├── extension/          # Chrome Extension



### For Technical Issues:npm run dev            # Development mode with watching

- Create GitHub Issues in this repository

- Contact AACC IT Department```- **Private Repository**: Restricted to AACC authorized personnel

- Review documentation in `/docs/README.md`



## 📄 Documentation

### Website Testing:- **Portal Password**: `aacc2025` (configurable)│   ├── dist/          # Compiled JavaScript (production ready)1. Install [Tampermonkey extension](https://www.tampermonkey.net/) from Chrome Web Store

- **Portal Documentation**: [`docs/README.md`](docs/README.md)

- **Deployment Guide**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)```bash



## 🔄 Update Processcd docs/- **HTTPS Only**: Secure distribution via GitHub Pages



1. **Automatic Detection**: Portal checks GitHub every 5 minutespython3 test-server.py  # Local test server

2. **User Notification**: Staff see update notifications on portal

3. **One-Click Download**: Easy installation of new versions# Opens http://localhost:8080- **Session Management**: 8-hour timeout for security│   ├── src/           # TypeScript source code2. Click the Tampermonkey icon → "Create a new script"

4. **Version Tracking**: Clear version information displayed

```

## ⚠️ Important Notes



- **Internal Use Only**: This tool is restricted to AACC personnel

- **DestinyOne Specific**: Designed for AACC's D1 implementation## 📦 Creating Extension Releases

- **Chrome Required**: Extension works with Chrome/Edge browsers

- **HTTPS Required**: Portal must be served over secure connection## 🚀 Quick Start│   ├── popup/         # Extension popup interface3. Replace the default template with content from `tampermonkey-d1-reorder.user.js`



## 📊 Version History1. **Build Extension**:



- **v1.2.0**: AACC official branding and logo integration   ```bash

- **v1.1.1**: Communication fixes and error handling improvements

- **v1.1.0**: Clean toggle interface implementation   cd extension/

- **v1.0.0**: Initial release with core functionality

   npm run build### For AACC Staff (Extension Users):│   └── manifest.json  # Extension configuration4. Save (Ctrl+S)

## 🤝 Contributing

   ```

For AACC IT Staff:

1. Create feature branch from `main`1. Visit the [AACC Portal](https://djmotor90.github.io/aacc-d1-extension-portal/)

2. Test changes thoroughly

3. Update documentation as needed2. **Create Release**:

4. Create pull request for review

5. Deploy after approval   ```bash2. Enter access code: `aacc2025`│5. Navigate to any D1 Student Profile page - it will work automatically!



---   git tag v1.2.0



**Repository**: [djmotor90/aacc-d1-extension-portal](https://github.com/djmotor90/aacc-d1-extension-portal)     git push origin v1.2.03. Download and install the latest extension

**Live Portal**: [https://djmotor90.github.io/aacc-d1-extension-portal/](https://djmotor90.github.io/aacc-d1-extension-portal/)  

**Maintained by**: AACC IT Department     ```

**Contact**: support@aacc.edu  

**Last Updated**: October 20254. Extension works automatically on D1 Student Profile pages├── website/           # AACC Portal Website

3. **Upload Extension**:

   - Go to GitHub Releases

   - Upload the extension folder as a zip file

   - Portal automatically detects new version### For AACC IT (Administrators):│   ├── index.html     # Main portal page### Option 2: Stylebot (CSS + Optional JS)



## 🌐 Live Portal1. Create new extension releases to distribute updates



- **URL**: [https://djmotor90.github.io/aacc-d1-extension-portal/](https://djmotor90.github.io/aacc-d1-extension-portal/)2. Upload extension zip files to GitHub releases│   ├── styles.css     # AACC-branded styling

- **Access**: Secure (contact AACC IT for credentials)

- **Status**: ✅ Production Ready3. Portal automatically detects and offers updates to users

- **Updates**: Automatic from GitHub releases

4. Monitor usage and support requests│   ├── script.js      # Portal functionality1. Install [Stylebot extension](https://stylebot.dev/) from Chrome Web Store

## 📋 Features



### Chrome Extension:

- ✅ Automatic Custom Fields positioning## 🛠 Development│   └── assets/        # Website resources2. Navigate to your D1 Student Profile page

- ✅ AACC official branding and colors

- ✅ Simple toggle interface for control

- ✅ Error handling and logging

- ✅ Performance optimized### Extension Development:```3. Click Stylebot icon → "Open Stylebot"



### Web Portal:```bash

- ✅ Password protection for security

- ✅ GitHub integration for updatescd extension/4. **CSS Tab**: Paste content from `stylebot-d1-reorder.css`

- ✅ Professional AACC branding

- ✅ Mobile responsive designnpm install

- ✅ Installation instructions

- ✅ Support and troubleshootingnpm run build          # Compile TypeScript## 🔐 Security & Access5. **JS Tab** (optional, for better reliability): Paste content from `stylebot-d1-reorder.js`

- ✅ Real-time update notifications

npm run dev            # Development mode with watching

## 🆘 Support

```6. Click "Save"

### For Extension Issues:

- **IT Help Desk**: (410) 777-2800

- **Email**: support@aacc.edu

- **Portal**: Built-in FAQ and troubleshooting### Website Testing:- **Private Repository**: Restricted to AACC authorized personnel



### For Technical Issues:```bash

- Create GitHub Issues in this repository

- Contact AACC IT Departmentcd website/- **Portal Password**: `aacc2025` (configurable)### Option 3: Chrome Extension (Full Control)

- Review documentation in `/docs/README.md`

python3 test-server.py  # Local test server

## 📄 Documentation

# Opens http://localhost:8080- **HTTPS Only**: Secure distribution via GitHub Pages

- **Portal Documentation**: [`docs/README.md`](docs/README.md)

- **Deployment Guide**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)# Password: aacc2025



## 🔄 Update Process```- **Session Management**: 8-hour timeout for security1. Open Chrome and navigate to `chrome://extensions/`



1. **Automatic Detection**: Portal checks GitHub every 5 minutes

2. **User Notification**: Staff see update notifications on portal

3. **One-Click Download**: Easy installation of new versions## 📦 Creating Extension Releases2. Enable "Developer mode" in the top right

4. **Version Tracking**: Clear version information displayed



## ⚠️ Important Notes

1. **Build Extension**:## 🚀 Quick Start3. Click "Load unpacked"

- **Internal Use Only**: This tool is restricted to AACC personnel

- **DestinyOne Specific**: Designed for AACC's D1 implementation   ```bash

- **Chrome Required**: Extension works with Chrome/Edge browsers

- **HTTPS Required**: Portal must be served over secure connection   cd extension/4. Select the folder containing these files



## 📊 Version History   npm run build



- **v1.2.0**: AACC official branding and logo integration   ```### For AACC Staff (Extension Users):5. The extension will be installed and ready to use

- **v1.1.1**: Communication fixes and error handling improvements

- **v1.1.0**: Clean toggle interface implementation

- **v1.0.0**: Initial release with core functionality

2. **Create Release**:1. Visit the AACC Portal (URL will be provided after deployment)

## 🤝 Contributing

   ```bash

For AACC IT Staff:

1. Create feature branch from `main`   git tag v1.0.12. Enter access code: `aacc2025`### Option 4: Manual Console Script

2. Test changes thoroughly

3. Update documentation as needed   git push origin v1.0.1

4. Create pull request for review

5. Deploy after approval   ```3. Download and install the latest extension



---



**Repository**: [djmotor90/aacc-d1-extension-portal](https://github.com/djmotor90/aacc-d1-extension-portal)  3. **Upload Extension**:4. Extension works automatically on D1 Student Profile pages1. Copy the content of `d1-profile-reorder.js`

**Live Portal**: [https://djmotor90.github.io/aacc-d1-extension-portal/](https://djmotor90.github.io/aacc-d1-extension-portal/)  

**Maintained by**: AACC IT Department     - Go to GitHub Releases

**Contact**: support@aacc.edu  

**Last Updated**: October 2025   - Upload the extension folder as a zip file2. Open the D1 Student Profile page

   - Portal automatically detects new version

### For AACC IT (Administrators):3. Open browser Developer Tools (F12)

## 🌐 Live Portal

1. Create new extension releases to distribute updates4. Go to Console tab

- **URL**: [https://djmotor90.github.io/aacc-d1-extension-portal/](https://djmotor90.github.io/aacc-d1-extension-portal/)

- **Access Code**: `aacc2025`2. Upload extension zip files to GitHub releases5. Paste the script and press Enter

- **Status**: ✅ Production Ready

- **Updates**: Automatic from GitHub releases3. Portal automatically detects and offers updates to users



## 📋 Features4. Monitor usage and support requests## How It Works



### Chrome Extension:

- ✅ Automatic Custom Fields positioning

- ✅ Visual indicators and styling  ## 🛠 Development1. **Page Detection**: The script detects if you're on a D1 Student Profile page

- ✅ Popup interface for manual control

- ✅ Error handling and logging2. **Element Location**: It finds the Custom Fields section (`#customFieldCollapse`)

- ✅ Performance optimized

### Extension Development:3. **Target Identification**: It locates the Student Status section as the insertion point

### Web Portal:

- ✅ Password protection (`aacc2025`)```bash4. **DOM Manipulation**: It moves the Custom Fields section to appear before Student Status

- ✅ GitHub integration for updates

- ✅ Professional AACC brandingcd extension/5. **Visual Enhancement**: It adds styling and indicators to show the change

- ✅ Mobile responsive design

- ✅ Installation instructionsnpm install

- ✅ Support and troubleshooting

- ✅ Real-time update notificationsnpm run build          # Compile TypeScript## Files Included



## 🆘 Supportnpm run dev            # Development mode with watching



### For Extension Issues:```### Tampermonkey Version (Recommended)

- **IT Help Desk**: (410) 777-2800

- **Email**: support@aacc.edu- `tampermonkey-d1-reorder.user.js` - Complete Tampermonkey userscript

- **Portal**: Built-in FAQ and troubleshooting

### Website Testing:

### For Technical Issues:

- Create GitHub Issues in this repository```bash### Stylebot Version  

- Contact AACC IT Department

- Review documentation in `/docs/README.md`cd website/- `stylebot-d1-reorder.css` - CSS for Stylebot



## 📄 Documentationpython3 test-server.py  # Local test server- `stylebot-d1-reorder.js` - Optional JavaScript for Stylebot



- **Portal Documentation**: [`docs/README.md`](docs/README.md)# Opens http://localhost:8080

- **Deployment Guide**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

# Password: aacc2025### Chrome Extension Version

## 🔄 Update Process

```- `manifest.json` - Chrome extension manifest

1. **Automatic Detection**: Portal checks GitHub every 5 minutes

2. **User Notification**: Staff see update notifications on portal- `d1-profile-reorder.js` - Main JavaScript functionality

3. **One-Click Download**: Easy installation of new versions

4. **Version Tracking**: Clear version information displayed## 📦 Creating Extension Releases- `d1-profile-reorder.css` - CSS styling and fallback positioning



## ⚠️ Important Notes- `popup.html` - Extension popup interface



- **Internal Use Only**: This tool is restricted to AACC personnel1. **Build Extension**:- `popup.js` - Popup functionality

- **DestinyOne Specific**: Designed for AACC's D1 implementation

- **Chrome Required**: Extension works with Chrome/Edge browsers   ```bash

- **HTTPS Required**: Portal must be served over secure connection

   cd extension/### Documentation

## 📊 Version History

   npm run build- `README.md` - This documentation

- **v1.0.0**: Initial release with core functionality

- **Future**: Additional D1 enhancements as requested   ```



## 🤝 Contributing## Usage



For AACC IT Staff:2. **Create Release**:

1. Create feature branch from `main`

2. Test changes thoroughly   ```bash### Automatic Mode

3. Update documentation as needed

4. Create pull request for review   git tag v1.0.11. Install the extension

5. Deploy after approval

   git push origin v1.0.12. Navigate to any D1 Student Profile page

---

   ```3. The Custom Fields section will automatically move to the top

**Repository**: [djmotor90/aacc-d1-extension-portal](https://github.com/djmotor90/aacc-d1-extension-portal)  

**Live Portal**: [https://djmotor90.github.io/aacc-d1-extension-portal/](https://djmotor90.github.io/aacc-d1-extension-portal/)  

**Maintained by**: AACC IT Department  

**Contact**: support@aacc.edu  3. **Upload Extension**:### Manual Mode

**Last Updated**: October 2025
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