/**
 * D1 Student Profile Customizer - Popup Interface
 * 
 * Handles the extension popup interface for monitoring
 * and controlling the D1 customization functionality.
 */

class D1PopupController {
  constructor() {
    this.isEnabled = false;
    this.currentVersion = '2.0.0';
    this.updateCheckUrl = 'https://djmotor90.github.io/aacc-d1-extension-portal/releases/';
    this.portalUrl = 'https://djmotor90.github.io/aacc-d1-extension-portal/';
    this.initializeElements();
    this.attachEventListeners();
    this.loadCurrentStatus();
    this.checkForUpdates();
  }
  
  initializeElements() {
    this.toggleSwitch = document.getElementById('extensionToggle');
    this.toggleDescription = document.getElementById('toggleDescription');
    this.statusDot = document.getElementById('statusDot');
    this.statusMessage = document.getElementById('statusMessage');
    
    // Update-related elements
    this.updateNotification = document.getElementById('updateNotification');
    this.updateVersion = document.getElementById('updateVersion');
    this.updateButton = document.getElementById('updateButton');
    this.currentVersionSpan = document.getElementById('currentVersion');
    this.checkUpdateBtn = document.getElementById('checkUpdateBtn');
    
    // Set current version
    if (this.currentVersionSpan) {
      this.currentVersionSpan.textContent = this.currentVersion;
    }
  }
  
  attachEventListeners() {
    this.toggleSwitch.addEventListener('change', (e) => this.handleToggle(e.target.checked));
    
    // Update-related event listeners
    if (this.updateButton) {
      this.updateButton.addEventListener('click', () => this.handleUpdateDownload());
    }
    
    if (this.checkUpdateBtn) {
      this.checkUpdateBtn.addEventListener('click', () => this.checkForUpdates(true));
    }
  }
  
  async loadCurrentStatus() {
    try {
      // Get stored extension state
      const result = await chrome.storage.local.get(['extensionEnabled']);
      this.isEnabled = result.extensionEnabled || false;
      this.toggleSwitch.checked = this.isEnabled;
      
      const tab = await this.getCurrentTab();
      
      if (!tab.url) {
        this.updateStatus('inactive', 'No tab information');
        return;
      }
      
      // Check if this is a D1 page
      const isD1Page = this.isD1StudentProfilePage(tab.url);
      
      if (!isD1Page) {
        this.updateStatus('inactive', 'Navigate to a D1 Student Profile page');
        return;
      }
      
      // Update status based on toggle state and page
      if (this.isEnabled) {
        this.updateStatus('active', 'Enhancement active on this page');
      } else {
        this.updateStatus('ready', 'Ready - toggle to enable enhancement');
      }
      
    } catch (error) {
      console.error('[D1-Popup] Error loading status:', error);
      this.updateStatus('error', 'Error checking page status');
    }
  }
  
  async getCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0] || {});
      });
    });
  }
  
  isD1StudentProfilePage(url) {
    return url.includes('studentProfile.do') || 
           url.includes('studentProfile') ||
           url.includes('destiny');
  }
  
  async getContentScriptStatus(tabId) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { 
        action: 'getStatus' 
      });
      return response;
    } catch (error) {
      console.log('[D1-Popup] Content script not ready or page not supported');
      return null;
    }
  }
  
  updateStatus(type, message) {
    // Update status indicator and message
    this.statusDot.className = 'status-dot';
    
    switch (type) {
      case 'active':
        this.statusDot.classList.add('active');
        this.statusMessage.textContent = message;
        this.toggleDescription.textContent = 'Custom Fields are positioned below Student Status';
        break;
        
      case 'ready':
        this.statusMessage.textContent = message;
        this.toggleDescription.textContent = 'Toggle to move Custom Fields below Student Status';
        break;
        
      case 'inactive':
        this.statusDot.classList.add('inactive');
        this.statusMessage.textContent = message;
        this.toggleDescription.textContent = 'Extension works on D1 Student Profile pages';
        break;
        
      case 'error':
        this.statusDot.classList.add('inactive');
        this.statusMessage.textContent = message;
        this.toggleDescription.textContent = 'Please refresh the page and try again';
        break;
    }
  }
  
  async handleToggle(enabled) {
    try {
      this.isEnabled = enabled;
      
      // Save state
      await chrome.storage.local.set({ extensionEnabled: enabled });
      
      const tab = await this.getCurrentTab();
      
      if (!tab.id || !this.isD1StudentProfilePage(tab.url)) {
        // Just update the toggle state, don't do anything else
        this.loadCurrentStatus();
        return;
      }
      
      // First check if content script is ready
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
      } catch (pingError) {
        // Content script not ready - inject it
        console.log('[D1-Popup] Content script not ready, injecting...');
        
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['dist/content.js']
          });
          
          // Wait a bit for initialization
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (injectError) {
          console.error('[D1-Popup] Failed to inject content script:', injectError);
          this.updateStatus('error', 'Content script injection failed');
          this.toggleSwitch.checked = !enabled;
          this.isEnabled = !enabled;
          return;
        }
      }
      
      if (enabled) {
        // Send enable command to content script
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'enable'
        });
        
        if (response && response.success) {
          this.updateStatus('active', 'Enhancement activated');
        } else {
          const errorMsg = response?.error || 'Unknown error';
          this.updateStatus('error', `Failed to activate: ${errorMsg}`);
          this.toggleSwitch.checked = false;
          this.isEnabled = false;
        }
      } else {
        // Send disable command to content script
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'disable'
        });
        
        if (response && response.success) {
          this.updateStatus('ready', 'Enhancement disabled');
        } else {
          this.updateStatus('ready', 'Enhancement disabled (forced)');
        }
      }
      
    } catch (error) {
      console.error('[D1-Popup] Toggle error:', error);
      this.updateStatus('error', 'Communication failed - try refreshing page');
      // Revert toggle state on error
      this.toggleSwitch.checked = !enabled;
      this.isEnabled = !enabled;
    }
  }

  /**
   * Check for extension updates
   */
  async checkForUpdates(manual = false) {
    try {
      if (manual && this.checkUpdateBtn) {
        this.checkUpdateBtn.style.transform = 'rotate(180deg)';
      }

      // Simulate checking by fetching the portal page
      const response = await fetch(`${this.portalUrl}script.js`);
      const scriptContent = await response.text();
      
      // Extract version from the portal script
      const versionMatch = scriptContent.match(/currentVersion\s*=\s*['"]([^'"]+)['"]/);
      const latestVersion = versionMatch ? versionMatch[1] : this.currentVersion;
      
      if (this.isNewerVersion(latestVersion, this.currentVersion)) {
        this.showUpdateNotification(latestVersion);
        
        if (manual) {
          this.showUpdateDialog(latestVersion);
        }
      } else if (manual) {
        this.showNoUpdateDialog();
      }
      
    } catch (error) {
      console.error('Error checking for updates:', error);
      if (manual) {
        this.showUpdateErrorDialog();
      }
    } finally {
      if (manual && this.checkUpdateBtn) {
        setTimeout(() => {
          this.checkUpdateBtn.style.transform = 'rotate(0deg)';
        }, 500);
      }
    }
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
   * Show update notification in popup
   */
  showUpdateNotification(version) {
    if (this.updateNotification && this.updateVersion) {
      this.updateVersion.textContent = `v${version}`;
      this.updateNotification.style.display = 'flex';
    }
  }

  /**
   * Handle update download button click
   */
  handleUpdateDownload() {
    // Open the portal in a new tab for download
    chrome.tabs.create({
      url: this.portalUrl,
      active: true
    });
  }

  /**
   * Show update available dialog
   */
  showUpdateDialog(version) {
    const message = `🆕 New version available!\n\n` +
                   `Current: v${this.currentVersion}\n` +
                   `Latest: v${version}\n\n` +
                   `Click OK to open the download portal.`;
                   
    if (confirm(message)) {
      this.handleUpdateDownload();
    }
  }

  /**
   * Show no update available dialog
   */
  showNoUpdateDialog() {
    alert(`✅ You have the latest version!\n\nCurrent version: v${this.currentVersion}`);
  }

  /**
   * Show update check error dialog
   */
  showUpdateErrorDialog() {
    const message = `❌ Unable to check for updates\n\n` +
                   `Please check your internet connection\n` +
                   `or visit the portal manually:\n\n` +
                   `${this.portalUrl}`;
                   
    if (confirm(message + '\n\nOpen portal now?')) {
      this.handleUpdateDownload();
    }
  }
}

// Initialize popup controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new D1PopupController();
});