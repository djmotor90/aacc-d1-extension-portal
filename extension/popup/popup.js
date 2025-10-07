/**
 * D1 Student Profile Customizer - Popup Interface
 * 
 * Handles the extension popup interface for monitoring
 * and controlling the D1 customization functionality.
 */

class D1PopupController {
  constructor() {
    this.initializeElements();
    this.attachEventListeners();
    this.loadCurrentStatus();
  }
  
  initializeElements() {
    this.statusIcon = document.getElementById('statusIcon');
    this.statusText = document.getElementById('statusText');
    this.statusDetail = document.getElementById('statusDetail');
    this.refreshBtn = document.getElementById('refreshBtn');
    this.customizeBtn = document.getElementById('customizeBtn');
    this.debugSection = document.getElementById('debugSection');
  }
  
  attachEventListeners() {
    this.refreshBtn.addEventListener('click', () => this.handleRefresh());
    this.customizeBtn.addEventListener('click', () => this.handleCustomize());
    
    const supportLink = document.getElementById('supportLink');
    if (supportLink) {
      supportLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSupportPage();
      });
    }
    
    const feedbackLink = document.getElementById('feedbackLink');
    if (feedbackLink) {
      feedbackLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openFeedbackPage();
      });
    }
  }
  
  async loadCurrentStatus() {
    try {
      const tab = await this.getCurrentTab();
      
      if (!tab.url) {
        this.updateStatus('inactive', 'No tab information');
        return;
      }
      
      // Check if this is a D1 page
      const isD1Page = this.isD1StudentProfilePage(tab.url);
      
      if (!isD1Page) {
        this.updateStatus('inactive', 'Not on D1 Student Profile page', tab);
        return;
      }
      
      // Get detailed status from content script
      const status = await this.getContentScriptStatus(tab.id);
      this.updateStatus('active', 'D1 Student Profile page detected', tab, status);
      
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
  
  updateStatus(type, message, tab, status) {
    // Update status icon and text
    switch (type) {
      case 'active':
        this.statusIcon.textContent = '🟢';
        this.statusText.textContent = 'D1 Page Active';
        this.statusDetail.textContent = 'Ready to customize Custom Fields positioning';
        this.customizeBtn.removeAttribute('disabled');
        break;
        
      case 'success':
        this.statusIcon.textContent = '✅';
        this.statusText.textContent = 'Customization Applied';
        this.statusDetail.textContent = 'Custom Fields section moved successfully';
        break;
        
      case 'inactive':
        this.statusIcon.textContent = '⚪';
        this.statusText.textContent = 'Not on D1 Page';
        this.statusDetail.textContent = 'Navigate to a DestinyOne Student Profile page to activate';
        this.customizeBtn.setAttribute('disabled', '');
        break;
        
      case 'error':
        this.statusIcon.textContent = '❌';
        this.statusText.textContent = 'Error';
        this.statusDetail.textContent = message;
        this.customizeBtn.setAttribute('disabled', '');
        break;
    }
    
    // Update debug information if available
    if (tab || status) {
      this.updateDebugInfo(tab, status);
      this.debugSection.style.display = 'block';
    }
  }
  
  updateDebugInfo(tab, status) {
    if (tab) {
      const urlElement = document.getElementById('debugUrl');
      const titleElement = document.getElementById('debugTitle');
      
      if (urlElement) urlElement.textContent = tab.url || 'Unknown';
      if (titleElement) titleElement.textContent = tab.title || 'Unknown';
    }
    
    if (status) {
      const customFieldsElement = document.getElementById('debugCustomFields');
      const studentStatusElement = document.getElementById('debugStudentStatus');
      const lastActionElement = document.getElementById('debugLastAction');
      
      if (customFieldsElement) {
        customFieldsElement.textContent = status.hasCustomFields ? '✅ Found' : '❌ Not Found';
      }
      if (studentStatusElement) {
        studentStatusElement.textContent = status.hasStudentStatus ? '✅ Found' : '❌ Not Found';
      }
      if (lastActionElement) {
        lastActionElement.textContent = status.lastAction || 'None';
      }
    }
  }
  
  async handleRefresh() {
    this.refreshBtn.textContent = '🔄 Checking...';
    this.refreshBtn.setAttribute('disabled', '');
    
    try {
      await this.loadCurrentStatus();
    } finally {
      setTimeout(() => {
        this.refreshBtn.innerHTML = '<span>🔄</span>Check Current Page';
        this.refreshBtn.removeAttribute('disabled');
      }, 1000);
    }
  }
  
  async handleCustomize() {
    this.customizeBtn.textContent = '📍 Moving...';
    this.customizeBtn.setAttribute('disabled', '');
    
    try {
      const tab = await this.getCurrentTab();
      
      if (!tab.id) {
        throw new Error('No active tab found');
      }
      
      // Send customize command to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'customize'
      });
      
      if (response && response.success) {
        this.updateStatus('success', 'Custom Fields moved successfully');
      } else {
        this.updateStatus('error', (response && response.error) || 'Failed to customize page');
      }
      
    } catch (error) {
      console.error('[D1-Popup] Customization error:', error);
      this.updateStatus('error', 'Failed to communicate with page');
    } finally {
      setTimeout(() => {
        this.customizeBtn.innerHTML = '<span>📍</span>Move Custom Fields';
        this.customizeBtn.removeAttribute('disabled');
      }, 2000);
    }
  }
  
  openSupportPage() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/d1-student-profile-customizer/issues'
    });
  }
  
  openFeedbackPage() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/d1-student-profile-customizer/discussions'
    });
  }
}

// Initialize popup controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new D1PopupController();
});