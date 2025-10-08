# GitHub Repository Setup - AACC D1 Extension Portal

## Step 1: Create Private GitHub Repository

### Option A: Via GitHub CLI (if you have it installed)
```bash
# Install GitHub CLI if not already installed
# brew install gh  # macOS
# gh auth login    # Login to GitHub

# Create private repository
gh repo create aacc-d1-extension-portal --private --description "AACC D1 Student Profile Customizer - Internal Tool"
```

### Option B: Via GitHub Website (Recommended)
1. Go to [GitHub.com](https://github.com) and login
2. Click the "+" button in top right → "New repository"
3. Repository settings:
   - **Repository name**: `aacc-d1-extension-portal`
   - **Description**: `AACC D1 Student Profile Customizer - Internal Tool`
   - **Visibility**: ✅ **Private** (Important!)
   - **Initialize**: ❌ Don't add README, gitignore, or license (we have them)
4. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the GitHub repository, you'll see a page with setup instructions. Use these commands:

```bash
# Navigate to your project directory
cd /Users/kgurinov/Documents/Coding/AACC/d1studentprofile

# Add GitHub remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/aacc-d1-extension-portal.git

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source":
   - Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)` or `/docs` (we have both)
5. Click "Save"

GitHub will provide you with a URL like:
`https://YOUR-USERNAME.github.io/aacc-d1-extension-portal/`

## Step 4: Update Repository URLs in Code

After GitHub Pages is enabled, update these files:

### In `docs/script.js` (line ~8):
```javascript
this.githubRepo = 'YOUR-USERNAME/aacc-d1-extension-portal';
```

### In `docs/github-integration.js` (line ~102):
```javascript
this.github = new GitHubIntegration('YOUR-USERNAME', 'aacc-d1-extension-portal');
```

### In `website/script.js` and `website/github-integration.js`:
Make the same changes as above.

## Step 5: Commit and Push Updates

```bash
# After updating the repository URLs
git add .
git commit -m "Update GitHub repository URLs for integration"
git push origin main
```

## Step 6: Test the Live Website

1. Wait 5-10 minutes for GitHub Pages to deploy
2. Visit your GitHub Pages URL
3. Test password: Contact AACC IT for access credentials
4. Verify all functionality works

## Step 7: Create First Extension Release

To test the auto-update system:

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `D1 Extension v1.0.0`
5. Upload the extension as a zip file:
   ```bash
   # Create extension zip
   cd extension/
   zip -r ../d1-extension-v1.0.0.zip . -x "node_modules/*" "src/*" "*.md"
   ```
6. Attach the zip file to the release
7. Publish release

## Repository URLs to Replace

Find and replace these placeholders in your code:

**Replace**: `your-org/d1-student-profile-customizer`  
**With**: `YOUR-USERNAME/aacc-d1-extension-portal`

**Replace**: `https://your-org.github.io/d1-extension-portal/`  
**With**: `https://YOUR-USERNAME.github.io/aacc-d1-extension-portal/`

## Security Settings (Recommended)

### Repository Security:
1. Go to repository "Settings" → "Security"
2. Enable "Private vulnerability reporting"
3. Add AACC IT staff as collaborators with appropriate permissions

### Branch Protection:
1. Go to "Settings" → "Branches"
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Dismiss stale reviews
   - ✅ Require status checks

## Final Checklist

- [ ] Repository created and set to **Private**
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Repository URLs updated in code
- [ ] Website accessible and password works
- [ ] First release created with extension zip
- [ ] Auto-update system tested
- [ ] AACC staff added as collaborators

## Troubleshooting

### GitHub Pages not working:
- Check "Settings" → "Pages" for build status
- Ensure files are in correct location (`docs/` or root)
- Wait 5-10 minutes after enabling

### Website shows 404:
- Verify GitHub Pages source is set correctly
- Check file names (case sensitive)
- Ensure `index.html` exists in the root/docs folder

### Auto-updates not working:
- Verify repository URLs are correct
- Check GitHub API rate limits
- Ensure releases have zip file attachments
- Test API endpoint: `https://api.github.com/repos/YOUR-USERNAME/aacc-d1-extension-portal/releases/latest`

---

**Next Steps**: Once repository is created, run the commands above and update this file with your actual GitHub username and URLs.