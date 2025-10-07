/**
 * D1 Student Profile Customizer - Background Service Worker
 * 
 * Handles extension lifecycle, tab management, and communication
 * between popup and content scripts.
 */

// Track extension state and tab information
let extensionState = {
  activeTabs: new Map(),
  lastKnownStatus: null,
  debugMode: false
};

// Initialize service worker
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[D1-Background] Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    console.log('[D1-Background] First time installation - setting up extension');
    setupInitialState();
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('[D1-Background] Extension updated from version:', details.previousVersion);
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('[D1-Background] Extension startup - reinitializing state');
  setupInitialState();
});

// Monitor tab updates to detect D1 pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process complete page loads
  if (changeInfo.status !== 'complete') return;
  
  // Check if this is a D1 Student Profile page
  if (tab.url && isD1StudentProfilePage(tab.url)) {
    console.log('[D1-Background] D1 Student Profile page detected:', tab.url);
    
    // Update tab state
    extensionState.activeTabs.set(tabId, {
      url: tab.url,
      title: tab.title,
      lastSeen: Date.now(),
      isD1Page: true
    });
    
    // Inject content script if needed
    injectContentScriptIfNeeded(tabId);
    
    // Update badge
    updateBadge(tabId, 'active');
  } else {
    // Remove from active tabs if it was previously a D1 page
    if (extensionState.activeTabs.has(tabId)) {
      extensionState.activeTabs.delete(tabId);
      updateBadge(tabId, 'inactive');
    }
  }
});

// Clean up closed tabs
chrome.tabs.onRemoved.addListener((tabId) => {
  if (extensionState.activeTabs.has(tabId)) {
    console.log('[D1-Background] Cleaning up closed D1 tab:', tabId);
    extensionState.activeTabs.delete(tabId);
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[D1-Background] Received message:', message.action, 'from:', sender.tab?.id || 'popup');
  
  switch (message.action) {
    case 'getTabStatus':
      handleGetTabStatus(message, sender, sendResponse);
      return true; // Keep channel open for async response
      
    case 'updateStatus':
      handleStatusUpdate(message, sender);
      return false;
      
    case 'enableDebugMode':
      extensionState.debugMode = true;
      console.log('[D1-Background] Debug mode enabled');
      return false;
      
    case 'disableDebugMode':
      extensionState.debugMode = false;
      console.log('[D1-Background] Debug mode disabled');
      return false;
      
    default:
      console.log('[D1-Background] Unknown message action:', message.action);
      return false;
  }
});

/**
 * Set up initial extension state
 */
function setupInitialState() {
  extensionState = {
    activeTabs: new Map(),
    lastKnownStatus: null,
    debugMode: false
  };
  
  // Check all existing tabs for D1 pages
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && isD1StudentProfilePage(tab.url)) {
        console.log('[D1-Background] Found existing D1 page:', tab.url);
        extensionState.activeTabs.set(tab.id, {
          url: tab.url,
          title: tab.title,
          lastSeen: Date.now(),
          isD1Page: true
        });
      }
    });
  });
}

/**
 * Check if URL is a D1 Student Profile page
 */
function isD1StudentProfilePage(url) {
  if (!url) return false;
  
  const d1Patterns = [
    /studentProfile\.do/i,
    /studentProfile/i,
    /destiny.*student/i
  ];
  
  return d1Patterns.some(pattern => pattern.test(url));
}

/**
 * Inject content script into tab if not already present
 */
async function injectContentScriptIfNeeded(tabId) {
  try {
    // Test if content script is already injected by sending a ping
    const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    
    if (response?.pong) {
      console.log('[D1-Background] Content script already active in tab:', tabId);
      return;
    }
  } catch (error) {
    // Content script not present, inject it
    console.log('[D1-Background] Injecting content script into tab:', tabId);
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['dist/content.js']
      });
      
      await chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ['styles/content.css']
      });
      
      console.log('[D1-Background] Content script injected successfully');
    } catch (injectionError) {
      console.error('[D1-Background] Failed to inject content script:', injectionError);
    }
  }
}

/**
 * Update extension badge
 */
function updateBadge(tabId, status) {
  const config = {
    active: { text: '●', color: '#4CAF50' },
    inactive: { text: '', color: '#757575' },
    error: { text: '!', color: '#F44336' }
  };
  
  const badge = config[status] || config.inactive;
  
  chrome.action.setBadgeText({
    text: badge.text,
    tabId: tabId
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: badge.color,
    tabId: tabId
  });
}

/**
 * Handle tab status requests from popup
 */
async function handleGetTabStatus(message, sender, sendResponse) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    
    if (!activeTab) {
      sendResponse({ error: 'No active tab found' });
      return;
    }
    
    const tabInfo = extensionState.activeTabs.get(activeTab.id);
    const isD1Page = isD1StudentProfilePage(activeTab.url);
    
    let contentStatus = null;
    if (isD1Page) {
      try {
        contentStatus = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'getStatus'
        });
      } catch (error) {
        console.log('[D1-Background] Could not get content script status:', error.message);
      }
    }
    
    sendResponse({
      tab: {
        id: activeTab.id,
        url: activeTab.url,
        title: activeTab.title
      },
      isD1Page: isD1Page,
      tabInfo: tabInfo,
      contentStatus: contentStatus,
      extensionState: {
        debugMode: extensionState.debugMode,
        activeTabs: Array.from(extensionState.activeTabs.keys())
      }
    });
    
  } catch (error) {
    console.error('[D1-Background] Error getting tab status:', error);
    sendResponse({ error: error.message });
  }
}

/**
 * Handle status updates from content scripts
 */
function handleStatusUpdate(message, sender) {
  if (sender.tab) {
    const tabId = sender.tab.id;
    const tabInfo = extensionState.activeTabs.get(tabId) || {};
    
    // Update tab information
    extensionState.activeTabs.set(tabId, {
      ...tabInfo,
      ...message.status,
      lastUpdate: Date.now()
    });
    
    // Update badge based on status
    if (message.status.hasError) {
      updateBadge(tabId, 'error');
    } else if (message.status.isActive) {
      updateBadge(tabId, 'active');
    }
    
    console.log('[D1-Background] Status updated for tab:', tabId, message.status);
  }
}

// Error handling
chrome.runtime.onSuspend.addListener(() => {
  console.log('[D1-Background] Service worker suspending...');
});

// Keep service worker alive with periodic heartbeat
setInterval(() => {
  console.log('[D1-Background] Heartbeat - Active tabs:', extensionState.activeTabs.size);
}, 30000); // Every 30 seconds