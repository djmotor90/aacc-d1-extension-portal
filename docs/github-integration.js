/**
 * GitHub Integration for AACC D1 Extension Portal
 * Handles fetching releases and updates from GitHub repository
 */

class GitHubIntegration {
    constructor(repoOwner, repoName) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }
    
    /**
     * Get the latest release from GitHub
     */
    async getLatestRelease() {
        const cacheKey = 'latest-release';
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        try {
            const url = `${this.apiBase}/repos/${this.repoOwner}/${this.repoName}/releases/latest`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const release = await response.json();
            this.setCache(cacheKey, release);
            
            return release;
        } catch (error) {
            console.error('Error fetching latest release:', error);
            throw error;
        }
    }
    
    /**
     * Get all releases from GitHub
     */
    async getAllReleases() {
        const cacheKey = 'all-releases';
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        try {
            const url = `${this.apiBase}/repos/${this.repoOwner}/${this.repoName}/releases`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const releases = await response.json();
            this.setCache(cacheKey, releases);
            
            return releases;
        } catch (error) {
            console.error('Error fetching releases:', error);
            throw error;
        }
    }
    
    /**
     * Download a specific release asset
     */
    async downloadReleaseAsset(release, assetName) {
        const asset = release.assets.find(a => a.name.includes(assetName) || a.name.includes('.zip'));
        
        if (!asset) {
            throw new Error('Extension zip file not found in release assets');
        }
        
        // Create download link
        const link = document.createElement('a');
        link.href = asset.browser_download_url;
        link.download = asset.name;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return asset;
    }
    
    /**
     * Get repository information
     */
    async getRepoInfo() {
        const cacheKey = 'repo-info';
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        try {
            const url = `${this.apiBase}/repos/${this.repoOwner}/${this.repoName}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const repo = await response.json();
            this.setCache(cacheKey, repo);
            
            return repo;
        } catch (error) {
            console.error('Error fetching repo info:', error);
            throw error;
        }
    }
    
    /**
     * Cache management
     */
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    getFromCache(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return null;
        }
        
        const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
        
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

/**
 * Enhanced Extension Portal with Real GitHub Integration
 */
class EnhancedExtensionPortal extends AAACExtensionPortal {
    constructor() {
        super();
        
        // Initialize GitHub integration
        // Updated with actual repository details
        this.github = new GitHubIntegration('djmotor90', 'aacc-d1-extension-portal');
        
        // Override the simulated methods with real GitHub integration
        this.setupRealGitHubIntegration();
    }
    
    /**
     * Setup real GitHub integration
     */
    setupRealGitHubIntegration() {
        // Override the fetchLatestVersion method
        this.fetchLatestVersion = this.fetchLatestVersionFromGitHub.bind(this);
        
        // Comment out download override since we're using local zip files
        // this.handleDownload = this.handleDownloadFromGitHub.bind(this);
    }
    
    /**
     * Fetch latest version from actual GitHub repository
     */
    async fetchLatestVersionFromGitHub() {
        try {
            const release = await this.github.getLatestRelease();
            
            // Parse version from tag name (e.g., "v1.2.0" -> "1.2.0")
            const version = release.tag_name.replace(/^v/, '');
            
            // Store release data for download
            this.latestRelease = release;
            
            return version;
        } catch (error) {
            console.error('Error fetching version from GitHub:', error);
            
            // Fallback to current version if GitHub is unavailable
            return this.currentVersion;
        }
    }
    
    /**
     * Enhanced download with real GitHub releases (disabled - using local zip instead)
     */
    async handleDownloadFromGitHub(version = null) {
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn?.innerHTML;
        
        try {
            // Show loading state
            if (downloadBtn) {
                downloadBtn.innerHTML = '<span>⏳</span> Preparing Download...';
                downloadBtn.disabled = true;
            }
            
            this.showLoading('Fetching extension from GitHub...');
            
            // Get the latest release if not already loaded
            if (!this.latestRelease) {
                this.latestRelease = await this.github.getLatestRelease();
            }
            
            // Download the extension zip from GitHub
            const asset = await this.github.downloadReleaseAsset(this.latestRelease, 'extension');
            
            this.updateStatusBanner('✅ Download completed successfully!', 'success');
            
            // Show installation reminder
            setTimeout(() => {
                this.showInstallationReminder(asset.name);
            }, 1000);
            
        } catch (error) {
            console.error('Download error:', error);
            
            // Fallback to local extension if GitHub fails
            this.downloadLocalExtension();
            
        } finally {
            // Reset button state
            if (downloadBtn) {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }
            
            this.hideLoading();
        }
    }
    
    /**
     * Fallback to download local extension
     */
    async downloadLocalExtension() {
        try {
            this.showLoading('Preparing local extension...');
            
            // Create a zip of the local extension folder
            const zip = await this.createLocalExtensionZip();
            
            // Trigger download
            const link = document.createElement('a');
            link.href = zip.url;
            link.download = zip.filename;
            link.click();
            
            this.updateStatusBanner('✅ Local extension downloaded', 'success');
            
        } catch (error) {
            console.error('Local download error:', error);
            alert('Unable to download extension. Please contact support.');
            this.updateStatusBanner('❌ Download failed', 'error');
        }
    }
    
    /**
     * Create zip of local extension (requires JSZip library)
     */
    async createLocalExtensionZip() {
        // This would require loading JSZip library
        // For now, return a placeholder
        
        const placeholder = new Blob(['Extension package - Contact support for manual installation'], 
                                   { type: 'text/plain' });
        
        return {
            url: URL.createObjectURL(placeholder),
            filename: `d1-extension-local-v${this.currentVersion}.txt`
        };
    }
    
    /**
     * Show installation reminder dialog
     */
    showInstallationReminder(filename) {
        const message = `Downloaded: ${filename}\n\n` +
                       `Installation Steps:\n` +
                       `1. Extract the zip file\n` +
                       `2. Open Chrome → Extensions (chrome://extensions/)\n` +
                       `3. Enable "Developer mode"\n` +
                       `4. Click "Load unpacked" and select the extracted folder\n\n` +
                       `Need help? Check the installation guide on this page.`;
        
        alert(message);
    }
    
    /**
     * Get release notes for display
     */
    async getReleaseNotes(version) {
        try {
            const releases = await this.github.getAllReleases();
            const release = releases.find(r => r.tag_name.includes(version));
            
            return release ? release.body : 'No release notes available.';
        } catch (error) {
            console.error('Error fetching release notes:', error);
            return 'Unable to load release notes.';
        }
    }
    
    /**
     * Show detailed update information
     */
    async showUpdateDetails(newVersion) {
        try {
            const notes = await this.getReleaseNotes(newVersion);
            
            const message = `🆕 New Version Available: v${newVersion}\n\n` +
                          `Release Notes:\n${notes}\n\n` +
                          `Would you like to download the update now?`;
            
            if (confirm(message)) {
                this.handleDownload(newVersion);
            }
        } catch (error) {
            // Fallback to simple dialog
            this.showUpdateAvailableDialog(newVersion);
        }
    }
}

// Export for use in main script
window.EnhancedExtensionPortal = EnhancedExtensionPortal;
window.GitHubIntegration = GitHubIntegration;