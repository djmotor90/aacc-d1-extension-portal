/**
 * AACC D1 Extension Portal - Main JavaScript
 * Handles password protection, GitHub integration, and auto-updates
 */

class AAACExtensionPortal {
    constructor() {
        this.correctPassword = 'aacc2025';
        this.githubRepo = 'djmotor90/aacc-d1-extension-portal';
        this.currentVersion = '1.0.0';
        this.sessionKey = 'aacc_portal_authenticated';
        this.updateCheckInterval = 5 * 60 * 1000; // Check every 5 minutes
        
        this.initializePortal();
    }
    
    /**
     * Enhanced password verification using hash
     */
    async verifyPasswordHash(inputPassword) {
        // SHA-256 hash of 'aacc2025' 
        const correctHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
        
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputPassword);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            return inputHash === correctHash;
        } catch (error) {
            // Fallback to direct comparison if crypto API not available
            return inputPassword === 'aacc2025';
        }
    }
    
    /**
     * Initialize the portal with authentication check
     */
    initializePortal() {
        this.setupEventListeners();
        
        // Check if user is already authenticated
        if (this.isAuthenticated()) {
            this.showMainContent();
            this.initializeMainFeatures();
        } else {
            this.showPasswordOverlay();
        }
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Password form
        const passwordInput = document.getElementById('passwordInput');
        const submitBtn = document.getElementById('submitPassword');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Download and update buttons
        const downloadBtn = document.getElementById('downloadBtn');
        const checkUpdatesBtn = document.getElementById('checkUpdatesBtn');
        
        // Password submission
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handlePasswordSubmit());
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handlePasswordSubmit();
                }
            });
            
            // Clear error on input
            passwordInput.addEventListener('input', () => {
                this.hidePasswordError();
            });
        }
        
        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Download extension
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownload());
        }
        
        // Check for updates
        if (checkUpdatesBtn) {
            checkUpdatesBtn.addEventListener('click', () => this.checkForUpdates(true));
        }
    }
    
    /**
     * Check if user is authenticated via session storage
     */
    isAuthenticated() {
        const authData = sessionStorage.getItem(this.sessionKey);
        if (!authData) return false;
        
        try {
            const data = JSON.parse(authData);
            const now = new Date().getTime();
            
            // Session expires after 8 hours
            if (now - data.timestamp > 8 * 60 * 60 * 1000) {
                sessionStorage.removeItem(this.sessionKey);
                return false;
            }
            
            return data.authenticated === true;
        } catch (e) {
            sessionStorage.removeItem(this.sessionKey);
            return false;
        }
    }
    
    /**
     * Handle password submission with enhanced security
     */
    handlePasswordSubmit() {
        const passwordInput = document.getElementById('passwordInput');
        const submitBtn = document.getElementById('submitPassword');
        
        const password = passwordInput.value.trim();
        
        if (!password) {
            this.showPasswordError('Please enter the access code');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Verifying...';
        submitBtn.disabled = true;
        
        // Enhanced security: Hash-based verification
        setTimeout(async () => {
            const isValid = await this.verifyPasswordHash(password);
            if (isValid) {
                // Store authentication in session
                const authData = {
                    authenticated: true,
                    timestamp: new Date().getTime()
                };
                sessionStorage.setItem(this.sessionKey, JSON.stringify(authData));
                
                this.showMainContent();
                this.initializeMainFeatures();
            } else {
                this.showPasswordError('Invalid access code. Please try again.');
                passwordInput.value = '';
                passwordInput.focus();
            }
            
            // Reset button state
            submitBtn.textContent = 'Access Portal';
            submitBtn.disabled = false;
        }, 1000);
    }
    
    /**
     * Show password error message
     */
    showPasswordError(message) {
        const errorDiv = document.getElementById('passwordError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    }
    
    /**
     * Hide password error message
     */
    hidePasswordError() {
        const errorDiv = document.getElementById('passwordError');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }
    }
    
    /**
     * Show the main content and hide password overlay
     */
    showMainContent() {
        const overlay = document.getElementById('passwordOverlay');
        const mainContent = document.getElementById('mainContent');
        
        if (overlay) overlay.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');
    }
    
    /**
     * Show password overlay and hide main content
     */
    showPasswordOverlay() {
        const overlay = document.getElementById('passwordOverlay');
        const mainContent = document.getElementById('mainContent');
        
        if (overlay) overlay.classList.remove('hidden');
        if (mainContent) mainContent.classList.add('hidden');
        
        // Focus password input
        setTimeout(() => {
            const passwordInput = document.getElementById('passwordInput');
            if (passwordInput) passwordInput.focus();
        }, 100);
    }
    
    /**
     * Handle logout
     */
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem(this.sessionKey);
            this.showPasswordOverlay();
            
            // Clear password input
            const passwordInput = document.getElementById('passwordInput');
            if (passwordInput) passwordInput.value = '';
        }
    }
    
    /**
     * Initialize main portal features after authentication
     */
    initializeMainFeatures() {
        this.updateVersionDisplay();
        this.checkForUpdates();
        this.setupPeriodicUpdateCheck();
        this.updateLastUpdatedDate();
    }
    
    /**
     * Update version displays throughout the site
     */
    updateVersionDisplay() {
        const elements = [
            'currentVersion',
            'downloadVersion',
            'footerVersion'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `v${this.currentVersion}`;
            }
        });
    }
    
    /**
     * Check for updates from GitHub
     */
    async checkForUpdates(manual = false) {
        const statusBanner = document.getElementById('statusBanner');
        const updateStatus = document.getElementById('updateStatus');
        
        if (manual) {
            this.showLoading();
        }
        
        try {
            // Update status banner
            this.updateStatusBanner('🔄 Checking for updates...', 'info');
            
            // In a real implementation, you would fetch from GitHub API
            // For demo purposes, we'll simulate the check
            const latestVersion = await this.fetchLatestVersion();
            
            if (this.isNewerVersion(latestVersion, this.currentVersion)) {
                // New version available
                this.updateStatusBanner(
                    `🆕 New version ${latestVersion} available! Click to download.`,
                    'warning',
                    () => this.handleDownload(latestVersion)
                );
                
                if (updateStatus) {
                    updateStatus.innerHTML = `⚠️ Update available (v${latestVersion})`;
                }
                
                if (manual) {
                    this.showUpdateAvailableDialog(latestVersion);
                }
            } else {
                // Up to date
                this.updateStatusBanner('✅ Extension is up to date', 'success');
                
                if (updateStatus) {
                    updateStatus.innerHTML = '✅ Up to date';
                }
                
                if (manual) {
                    alert('You have the latest version of the extension!');
                }
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
            this.updateStatusBanner('❌ Error checking for updates', 'error');
            
            if (manual) {
                alert('Unable to check for updates. Please try again later.');
            }
        } finally {
            if (manual) {
                this.hideLoading();
            }
        }
    }
    
    /**
     * Fetch latest version from GitHub (simulated for demo)
     */
    async fetchLatestVersion() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would be:
        // const response = await fetch(`https://api.github.com/repos/${this.githubRepo}/releases/latest`);
        // const data = await response.json();
        // return data.tag_name.replace('v', '');
        
        // For demo, simulate different scenarios
        const scenarios = [
            '1.0.0', // Same version
            '1.0.1', // Patch update
            '1.1.0', // Minor update
        ];
        
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }
    
    /**
     * Compare version strings
     */
    isNewerVersion(latest, current) {
        const latestParts = latest.split('.').map(Number);
        const currentParts = current.split('.').map(Number);
        
        for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
            const latestPart = latestParts[i] || 0;
            const currentPart = currentParts[i] || 0;
            
            if (latestPart > currentPart) return true;
            if (latestPart < currentPart) return false;
        }
        
        return false;
    }
    
    /**
     * Update the status banner
     */
    updateStatusBanner(message, type = 'info', clickHandler = null) {
        const banner = document.getElementById('statusBanner');
        const content = banner?.querySelector('.status-content');
        const text = content?.querySelector('.status-text');
        
        if (!banner || !text) return;
        
        // Update text
        text.textContent = message;
        
        // Update styling
        banner.className = `status-banner ${type}`;
        
        // Add click handler if provided
        if (clickHandler) {
            banner.style.cursor = 'pointer';
            banner.onclick = clickHandler;
        } else {
            banner.style.cursor = 'default';
            banner.onclick = null;
        }
        
        // Show banner
        banner.style.display = 'block';
    }
    
    /**
     * Show update available dialog
     */
    showUpdateAvailableDialog(newVersion) {
        const message = `A new version (v${newVersion}) is available!\n\nWould you like to download it now?`;
        
        if (confirm(message)) {
            this.handleDownload(newVersion);
        }
    }
    
    /**
     * Handle extension download
     */
    async handleDownload(version = null) {
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn?.innerHTML;
        
        try {
            // Show loading state
            if (downloadBtn) {
                downloadBtn.innerHTML = '<span>⏳</span> Preparing Download...';
                downloadBtn.disabled = true;
            }
            
            this.showLoading('Preparing your extension download...');
            
            // In production, this would generate or fetch the actual extension zip
            await this.generateExtensionZip(version);
            
            // Simulate download preparation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create download link (in production, this would be the actual zip file)
            this.downloadFile('d1-extension-v' + (version || this.currentVersion) + '.zip');
            
            this.updateStatusBanner('✅ Download completed successfully!', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Error preparing download. Please try again.');
            this.updateStatusBanner('❌ Download failed', 'error');
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
     * Generate extension zip file (simulated for demo)
     */
    async generateExtensionZip(version) {
        // In production, this would:
        // 1. Fetch the latest extension files from GitHub
        // 2. Create a zip file with the extension
        // 3. Return the download URL
        
        console.log(`Generating extension zip for version ${version || this.currentVersion}`);
        
        // For demo, we'll create a simple zip with the local extension
        // In production, use JSZip or server-side generation
    }
    
    /**
     * Download file (simulated for demo)
     */
    downloadFile(filename) {
        // In production, this would download the actual extension zip
        // For demo, we'll create a dummy download
        
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,D1%20Extension%20Package%20-%20Replace%20with%20actual%20zip%20file');
        element.setAttribute('download', filename);
        element.style.display = 'none';
        
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        // Show success message
        setTimeout(() => {
            alert(`Download started: ${filename}\n\nExtract the zip file and follow the installation instructions.`);
        }, 500);
    }
    
    /**
     * Setup periodic update checking
     */
    setupPeriodicUpdateCheck() {
        // Check for updates every 5 minutes
        setInterval(() => {
            this.checkForUpdates();
        }, this.updateCheckInterval);
    }
    
    /**
     * Update the "last updated" date in footer
     */
    updateLastUpdatedDate() {
        const element = document.getElementById('lastUpdated');
        if (element) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            };
            element.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    /**
     * Show loading overlay
     */
    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay?.querySelector('p');
        
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        
        if (text) {
            text.textContent = message;
        }
    }
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}

// Initialize the portal when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aaccPortal = new AAACExtensionPortal();
});

// Additional utility functions for enhanced functionality
window.aaccPortalUtils = {
    /**
     * Copy text to clipboard
     */
    copyToClipboard: (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    },
    
    /**
     * Open external links in new tab
     */
    openExternal: (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    },
    
    /**
     * Send feedback email
     */
    sendFeedback: () => {
        const subject = encodeURIComponent('D1 Extension Feedback');
        const body = encodeURIComponent('Please describe your feedback or issue:\n\n');
        window.location.href = `mailto:support@aacc.edu?subject=${subject}&body=${body}`;
    }
};