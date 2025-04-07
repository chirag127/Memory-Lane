// Memory Lane Background Script
// Handles background tasks and messaging

// Initialize extension data on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize storage with empty memories object
    chrome.storage.local.set({ 
      memories: {},
      settings: {
        takeSnapshotByDefault: true,
        showPopupOnRevisit: true,
        useWaybackMachine: true
      }
    });
    
    // Open onboarding page
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    // Open the popup programmatically
    chrome.action.openPopup();
  }
  
  if (message.action === 'saveWaybackSnapshot') {
    // Save a snapshot to the Wayback Machine
    saveToWaybackMachine(message.url)
      .then(waybackUrl => {
        sendResponse({ success: true, waybackUrl });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
  
  if (message.action === 'checkMemory') {
    // Check if a URL exists in memories
    chrome.storage.local.get('memories', (data) => {
      const memories = data.memories || {};
      const exists = !!memories[message.url];
      sendResponse({ exists, memory: exists ? memories[message.url] : null });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

// Save a URL to the Wayback Machine
async function saveToWaybackMachine(url) {
  try {
    const response = await fetch(`https://web.archive.org/save/${url}`);
    
    if (!response.ok) {
      throw new Error('Failed to save to Wayback Machine');
    }
    
    return `https://web.archive.org/web/*/${url}`;
  } catch (error) {
    console.error('Wayback Machine error:', error);
    throw error;
  }
}

// Optional: Sync data with cloud storage if user is logged in
// This would require a backend service and authentication
function syncWithCloud() {
  // Check if user is logged in
  chrome.storage.local.get(['user', 'memories'], (data) => {
    if (data.user && data.user.loggedIn) {
      // User is logged in, sync data
      // This would call your backend API
      console.log('Syncing data with cloud...');
    }
  });
}
