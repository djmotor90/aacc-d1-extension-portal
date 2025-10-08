# AACC Pulse - Academic Workflow Enhancement Suite

AACC Pulse is a comprehensive Chrome extension that enhances academic workflows across multiple systems for Anne Arundel Community College staff. Originally designed for DestinyOne, it now supports multiple platforms and will adapt to future LLEE systems.

## Features

🚀 **Multi-System Support** - Works with DestinyOne Student Profiles and Course Section pages  
📍 **Smart Layout Enhancement** - Moves Custom Fields section below Student Status for better workflow  
🔗 **Public Link Generation** - Creates public course section links automatically  
🔍 **Enhanced Debugging** - Comprehensive logging and error handling  
� **Auto-Update Detection** - Checks for new versions and notifies users  
♿ **Accessibility Support** - Respects user preferences for motion and contrast  
📱 **Responsive Design** - Works on various screen sizes  
🎨 **AACC Official Branding** - Uses official Anne Arundel Community College styling  

## Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "D1 Student Profile Customizer"
3. Click "Add to Chrome"

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder
6. The extension is now installed and active

## Usage

### Automatic Mode
The extension works automatically when you visit DestinyOne Student Profile pages:

1. Navigate to any Student Profile page in DestinyOne
2. The extension detects the page automatically
3. Custom Fields section is moved below Student Status section
4. A blue indicator shows the section has been moved

### Manual Control
Use the extension popup for additional control:

1. Click the extension icon in your toolbar
2. View current page status and detected sections
3. Use "Move Custom Fields" button for manual repositioning
4. View debug information if needed

## Supported Pages

The extension activates on pages matching these patterns:
- `*://*/studentProfile.do*`
- `*://*/studentProfile*`
- Any DestinyOne domain with student profile content

## Technical Details

### Architecture
- **Manifest V3** - Modern Chrome extension architecture
- **TypeScript** - Enhanced development with type safety
- **Content Scripts** - DOM manipulation and page analysis
- **Service Worker** - Background state management
- **Popup Interface** - User control and status monitoring

### Key Components
- **Content Script** (`content.js`) - Main DOM manipulation logic
- **Background Script** (`background.js`) - Extension lifecycle management
- **Popup Interface** (`popup.html/js/css`) - User interaction panel
- **CSS Styles** (`content.css`) - Visual enhancements and indicators

### DOM Detection Strategy
The extension uses multiple detection methods for robust operation:

1. **Primary**: `#customFieldCollapse` element ID
2. **Secondary**: Text content analysis for "Custom Fields"
3. **Tertiary**: Field-specific markers like "Student Employment Verification Date"

## Development

### Prerequisites
- Node.js 16+ and npm
- Chrome browser
- TypeScript 5.2+

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd d1studentprofile/extension

# Install dependencies
npm install

# Build the extension
npm run build

# Development mode (watch for changes)
npm run dev
```

### Project Structure
```
extension/
├── src/
│   ├── content.ts          # Main content script
│   └── background.ts       # Service worker
├── popup/
│   ├── popup.html         # Popup interface
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styling
├── styles/
│   └── content.css        # Injected page styles
├── icons/
│   └── icon-128.svg       # Extension icon
├── dist/                  # Compiled output
├── manifest.json          # Extension manifest
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

### Build Commands
```bash
npm run build       # Full build (clean + compile)
npm run build:ts    # TypeScript compilation only
npm run clean       # Clean dist directory
npm run dev         # Watch mode for development
```

### Testing
1. Load extension in developer mode
2. Navigate to DestinyOne Student Profile page
3. Verify Custom Fields section moves below Student Status
4. Check browser console for detailed logs (prefix: `[D1-Customizer]`)

## Browser Compatibility

- ✅ Chrome 88+ (Manifest V3 support)
- ✅ Microsoft Edge 88+
- ✅ Brave Browser (Chromium-based)
- ❌ Firefox (different extension API)
- ❌ Safari (different extension system)

## Privacy & Security

- **No Data Collection** - Extension operates entirely locally
- **Minimal Permissions** - Only requests necessary host permissions
- **No Network Requests** - All functionality is client-side
- **Open Source** - Full source code available for inspection

## Permissions Explained

The extension requests these permissions:

- **Host Permissions** (`*://*/studentProfile*`) - Required to inject content scripts on DestinyOne pages
- **Active Tab** - Read current tab URL to detect D1 pages
- **Scripting** - Inject CSS and JavaScript for DOM manipulation

## Known Issues & Limitations

- **Dynamic Content**: May require page refresh on heavily dynamic DestinyOne implementations
- **Custom Themes**: Visual indicators may not match custom DestinyOne themes
- **Screen Readers**: Visual positioning changes may affect some assistive technologies
- **Multiple Instances**: Only processes first Custom Fields section if multiple exist

## Support & Contributing

### Reporting Issues
1. Check existing issues on GitHub
2. Include browser version and DestinyOne version
3. Provide console logs with `[D1-Customizer]` prefix
4. Include page URL (remove sensitive information)

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow existing TypeScript patterns
- Add comprehensive logging for debugging
- Test on multiple DestinyOne instances
- Update documentation for new features
- Maintain backward compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Anne Arundel Community College** - Primary use case and testing environment
- **Modern Campus** - DestinyOne Student Information System platform
- **Chrome Extensions Documentation** - Technical implementation guidance

## Version History

### v1.0.0 (Current)
- Initial release
- Automatic Custom Fields repositioning
- Chrome extension popup interface
- Enhanced debugging and logging
- TypeScript implementation
- Accessibility considerations

## Roadmap

### v1.1.0 (Planned)
- Configuration options for positioning preferences
- Support for additional DestinyOne page types
- Improved visual indicators and animations
- Performance optimizations

### v1.2.0 (Future)
- Firefox extension support (WebExtensions API)
- Multiple Custom Fields section handling
- Advanced DOM change detection
- User preferences storage

---

**Made for Anne Arundel Community College**  
Enhancing the DestinyOne Student Information System experience