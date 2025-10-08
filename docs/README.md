# AACC D1 Extension Portal

A secure web portal for distributing and managing the DestinyOne Student Profile Customizer extension for Anne Arundel Community College staff.

## 🔐 Security Features

- **Password Protection**: Access restricted with secure access code (contact AACC IT)
- **Session Management**: 8-hour session timeout for security
- **AACC Staff Only**: Designed specifically for authorized AACC personnel

## 🚀 Features

### Extension Management
- **Download Latest Version**: Always get the most current extension
- **GitHub Integration**: Automatic updates from repository releases
- **Version Tracking**: Clear version information and update notifications
- **Installation Guidance**: Step-by-step installation instructions

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Interface**: AACC-branded design with intuitive navigation
- **Support Resources**: FAQ, troubleshooting, and contact information
- **Real-time Status**: Live update checking and status notifications

### Technical Features
- **Automatic Updates**: Checks for new releases every 5 minutes
- **Smart Caching**: Efficient GitHub API usage with intelligent caching
- **Error Handling**: Graceful fallbacks when services are unavailable
- **Loading States**: Clear feedback during all operations

## 📁 File Structure

```
website/
├── index.html              # Main portal page
├── styles.css             # AACC-branded styling
├── script.js              # Core portal functionality
├── github-integration.js  # GitHub API integration
├── assets/
│   ├── favicon.svg        # Site icon
│   └── aacc-logo.png     # AACC logo (add this file)
└── README.md             # This file
```

## 🛠 Setup Instructions

### 1. Repository Configuration

Update the GitHub repository settings in `script.js`:

```javascript
// In script.js, line ~8
this.githubRepo = 'your-org/d1-student-profile-customizer';

// In github-integration.js, line ~102
this.github = new GitHubIntegration('your-org', 'd1-student-profile-customizer');
```

### 2. AACC Logo

Add the AACC logo to the assets folder:
- File: `assets/aacc-logo.png`
- Recommended size: 200x80px or similar aspect ratio
- Format: PNG with transparent background preferred

### 3. Deployment Options

#### Option A: GitHub Pages
1. Push this website folder to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch / docs folder
4. Access via `https://your-org.github.io/repo-name/`

#### Option B: AACC Web Server
1. Upload website files to AACC web server
2. Ensure HTTPS is enabled for security
3. Configure any necessary .htaccess rules

#### Option C: Static Hosting (Netlify, Vercel, etc.)
1. Connect repository to hosting service
2. Set build directory to website folder
3. Deploy with automatic GitHub integration

### 4. GitHub Release Setup

To enable automatic updates, set up your extension repository:

1. **Create Releases**: Tag your extension versions (e.g., `v1.0.1`)
2. **Upload Extension**: Attach the extension zip file to each release
3. **Release Notes**: Add changelog information for users
4. **Naming Convention**: Ensure zip files contain "extension" in the name

Example release workflow:
```bash
# Create and push a new tag
git tag v1.0.1
git push origin v1.0.1

# GitHub Actions can automatically create releases with extension zip
```

## 🔧 Configuration

### Password Security
- Default password: Contact AACC IT for access code
- To change: Update `correctPassword` in `script.js` line ~10
- Sessions expire after 8 hours automatically

### Update Frequency
- Default: Checks for updates every 5 minutes
- To change: Update `updateCheckInterval` in `script.js` line ~13

### Contact Information
- Update support email in multiple locations:
  - `index.html` (mailto links)
  - `script.js` (feedback functions)

## 🌐 Usage Instructions

### For AACC Staff:
1. Navigate to the portal URL
2. Enter access code: (provided by AACC IT)
3. Click "Download Latest Version"
4. Follow installation instructions
5. Extension will work automatically on D1 pages

### For Administrators:
1. Monitor GitHub repository for issues
2. Create releases for new extension versions
3. Update contact information as needed
4. Review portal analytics if available

## 🔍 Troubleshooting

### Common Issues:

**Portal not loading:**
- Check HTTPS configuration
- Verify all files are uploaded
- Check browser console for errors

**GitHub integration not working:**
- Verify repository name in configuration
- Check GitHub API rate limits
- Ensure repository is public or has proper access

**Download failing:**
- Check GitHub release has zip attachment
- Verify file naming convention
- Test with manual download link

### Support Contacts:
- **Technical Issues**: support@aacc.edu
- **Extension Problems**: IT Help Desk (410) 777-2800
- **Access Issues**: Contact system administrator

## 🔄 Updating the Portal

### Adding New Features:
1. Modify appropriate files (HTML, CSS, JS)
2. Test locally before deployment
3. Update this README if needed
4. Deploy to production

### Updating Extension:
1. Create new release in GitHub repository
2. Upload updated extension zip file
3. Portal will automatically detect and offer updates
4. Users will be notified on next visit

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for usage tracking
- Error logging for troubleshooting
- User feedback collection
- Download statistics

## 🔒 Security Considerations

- **HTTPS Required**: Always serve over secure connection
- **Password Storage**: Never store passwords in plain text
- **Session Security**: Sessions are client-side only (8-hour expiry)
- **Access Logging**: Consider server-side access logging
- **Regular Updates**: Keep portal and extension updated

## 📝 License

Internal tool for Anne Arundel Community College. Not for public distribution.

## 🤝 Contributing

For AACC IT Staff:
1. Test changes in development environment
2. Follow AACC coding standards
3. Document any changes in this README
4. Coordinate with stakeholders before deployment

---

**For Support**: Contact AACC IT Department  
**Last Updated**: October 2025  
**Version**: 1.0.0