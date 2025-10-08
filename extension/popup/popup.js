/**
 * D1 Student Profile Customizer - Popup Interface
 * 
 * Handles the extension popup interface for monitoring
 * and controlling the D1 customization functionality.
 */

class D1PopupController {
  constructor() {
    this.isEnabled = false;
    this.initializeElements();
    this.attachEventListeners();
    this.loadCurrentStatus();
  }
  
  initializeElements() {
    this.toggleSwitch = document.getElementById('extensionToggle');
    this.toggleDescription = document.getElementById('toggleDescription');
    this.statusDot = document.getElementById('statusDot');
    this.statusMessage = document.getElementById('statusMessage');
  }
  
  attachEventListeners() {
    this.toggleSwitch.addEventListener('change', (e) => this.handleToggle(e.target.checked));
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
}

// Initialize popup controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new D1PopupController();
});