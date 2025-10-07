# AACC D1 Extension Portal - Deployment Guide

## Quick Deployment Checklist

### 1. Pre-Deployment Setup
- [ ] Update GitHub repository name in `script.js` (line 8)
- [ ] Update GitHub repository name in `github-integration.js` (line 102)
- [ ] Add AACC logo to `assets/aacc-logo.png`
- [ ] Update contact information (email, phone) in HTML and JS
- [ ] Test locally by opening `index.html` in browser

### 2. GitHub Repository Setup
- [ ] Create GitHub repository for the extension
- [ ] Enable GitHub Actions (optional, for automated releases)
- [ ] Create first release with extension zip file
- [ ] Verify release API endpoint works

### 3. Web Hosting Options

#### Option A: GitHub Pages (Recommended for testing)
```bash
# 1. Create new repository
git init
git add .
git commit -m "Initial AACC portal deployment"
git branch -M main
git remote add origin https://github.com/your-org/d1-portal.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to Settings > Pages > Select "Deploy from a branch" > Select "main" > Save
```

#### Option B: AACC Internal Server
```bash
# 1. Connect to AACC server via SFTP/SSH
scp -r website/* user@server.aacc.edu:/var/www/html/d1-portal/

# 2. Set proper permissions
chmod 644 *.html *.css *.js *.md
chmod 755 assets/
chmod 644 assets/*
```

#### Option C: Netlify (Easy deployment)
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
cd website/
netlify deploy --prod --dir .
```

### 4. DNS & SSL Configuration

#### For AACC Subdomain:
```
# DNS Record (contact AACC network admin)
d1-portal.aacc.edu CNAME your-hosting-provider.com

# Or A Record
d1-portal.aacc.edu A 192.168.1.100
```

#### SSL Certificate:
- Ensure HTTPS is enabled (required for security)
- Most hosting providers offer automatic SSL
- For internal servers, use AACC SSL certificate

### 5. Security Configuration

#### Web Server (Apache/Nginx):
```apache
# .htaccess for Apache (place in website root)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

```nginx
# nginx.conf for Nginx
server {
    listen 80;
    server_name d1-portal.aacc.edu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name d1-portal.aacc.edu;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/html/d1-portal;
    index index.html;
    
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
}
```

## Automated Deployment with GitHub Actions

### `.github/workflows/deploy.yml`:
```yaml
name: Deploy AACC Portal

on:
  push:
    branches: [ main ]
    paths: [ 'website/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/html/d1-portal
          git pull origin main
          cp website/* .
          chmod 644 *.html *.css *.js
```

## Extension Release Automation

### GitHub Actions for Extension Releases:
```yaml
# .github/workflows/release-extension.yml
name: Create Extension Release

on:
  push:
    tags: [ 'v*' ]

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Extension
      run: |
        cd extension
        npm install
        npm run build
        zip -r ../d1-extension-${{ github.ref_name }}.zip . -x "node_modules/*" "src/*" "*.md"
    
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: D1 Extension ${{ github.ref }}
        draft: false
        prerelease: false
    
    - name: Upload Extension
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }}
        asset_path: ./d1-extension-${{ github.ref_name }}.zip
        asset_name: d1-extension-${{ github.ref_name }}.zip
        asset_content_type: application/zip
```

## Testing Checklist

### Pre-Launch Testing:
- [ ] Password protection works (`aacc2025`)
- [ ] Session timeout (8 hours) functions properly
- [ ] Download button creates proper zip file
- [ ] GitHub integration fetches correct versions
- [ ] Update notifications appear correctly
- [ ] Mobile responsiveness works
- [ ] All links and contact information work
- [ ] FAQ sections expand/collapse properly

### Post-Launch Monitoring:
- [ ] Monitor server logs for errors
- [ ] Check GitHub API rate limits
- [ ] Verify download analytics
- [ ] Test from different AACC locations
- [ ] Confirm HTTPS certificate validity

## Maintenance Tasks

### Weekly:
- [ ] Check for extension updates
- [ ] Review server logs for errors
- [ ] Verify portal accessibility

### Monthly:
- [ ] Update contact information if needed
- [ ] Review user feedback
- [ ] Check SSL certificate expiration
- [ ] Update dependencies if any

### Quarterly:
- [ ] Review security settings
- [ ] Update documentation
- [ ] Assess user needs and feedback
- [ ] Plan feature enhancements

## Troubleshooting Common Issues

### Portal Won't Load:
1. Check HTTPS configuration
2. Verify DNS settings
3. Check server permissions
4. Review browser console errors

### GitHub Integration Failing:
1. Verify repository exists and is accessible
2. Check API rate limits (5000/hour for authenticated)
3. Test API endpoint manually
4. Check network connectivity

### Downloads Not Working:
1. Verify GitHub releases exist
2. Check zip file attachments
3. Test file permissions
4. Review browser download settings

## Contact for Deployment Support

- **AACC IT Department**: (410) 777-2800
- **Web Services**: webservices@aacc.edu
- **Network Administration**: netadmin@aacc.edu

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Production URL**: ___________  
**Backup Location**: ___________