// Memory Lane Content Script
// This script runs on every page and checks if the current URL is in the user's memories

(function() {
  // Variables
  let currentUrl = window.location.href;
  let popupVisible = false;
  let minimizeButton = null;
  let popup = null;
  
  // Initialize
  function init() {
    // Check if this URL is in memories
    checkIfMemoryExists(currentUrl);
    
    // Listen for URL changes (for single-page applications)
    observeUrlChanges();
  }
  
  // Check if the current URL exists in memories
  function checkIfMemoryExists(url) {
    chrome.storage.local.get('memories', (data) => {
      const memories = data.memories || {};
      
      if (memories[url]) {
        // This URL is in memories, show popup after a short delay
        setTimeout(() => {
          showMemoryPopup(memories[url]);
        }, 1500);
      }
    });
  }
  
  // Create and show the memory popup
  function showMemoryPopup(memory) {
    // Create popup if it doesn't exist
    if (!popup) {
      createPopup();
    }
    
    // Format date
    const memoryDate = new Date(memory.timestamp);
    const formattedDate = memoryDate.toLocaleString();
    
    // Populate popup content
    const contentElement = popup.querySelector('.memory-lane-content');
    contentElement.innerHTML = `
      <div class="memory-lane-date">Saved on ${formattedDate}</div>
      <div class="memory-lane-note">${memory.note || 'No notes added'}</div>
    `;
    
    // Add tags if they exist
    if (memory.tags && memory.tags.length > 0) {
      const tagsHtml = memory.tags.map(tag => `<div class="memory-lane-tag">${tag}</div>`).join('');
      contentElement.innerHTML += `
        <div class="memory-lane-tags">
          ${tagsHtml}
        </div>
      `;
    }
    
    // Add snapshot if it exists
    if (memory.snapshot) {
      contentElement.innerHTML += `
        <div class="memory-lane-snapshot">
          <img src="${memory.snapshot}" alt="Page snapshot">
        </div>
      `;
    }
    
    // Add action buttons
    contentElement.innerHTML += `
      <div class="memory-lane-actions">
        <button class="memory-lane-btn memory-lane-edit">Edit</button>
        <button class="memory-lane-btn memory-lane-wayback">View in Wayback Machine</button>
      </div>
    `;
    
    // Add event listeners to buttons
    const editBtn = popup.querySelector('.memory-lane-edit');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'openPopup' });
      });
    }
    
    const waybackBtn = popup.querySelector('.memory-lane-wayback');
    if (waybackBtn) {
      waybackBtn.addEventListener('click', () => {
        const waybackUrl = `https://web.archive.org/web/*/${currentUrl}`;
        window.open(waybackUrl, '_blank');
      });
    }
    
    // Show popup
    popup.classList.remove('hidden');
    popupVisible = true;
    
    // Show minimize button
    if (minimizeButton) {
      minimizeButton.classList.add('visible');
    }
  }
  
  // Create the popup elements
  function createPopup() {
    // Create popup container
    popup = document.createElement('div');
    popup.id = 'memory-lane-popup';
    popup.className = 'hidden';
    popup.innerHTML = `
      <div class="memory-lane-header">
        <h3 class="memory-lane-title">Memory Lane</h3>
        <button class="memory-lane-close">×</button>
      </div>
      <div class="memory-lane-content"></div>
    `;
    
    // Create minimize button
    minimizeButton = document.createElement('div');
    minimizeButton.className = 'memory-lane-minimize';
    minimizeButton.innerHTML = '↑';
    
    // Add event listeners
    const closeBtn = popup.querySelector('.memory-lane-close');
    closeBtn.addEventListener('click', hidePopup);
    
    minimizeButton.addEventListener('click', () => {
      popup.classList.remove('hidden');
      minimizeButton.classList.remove('visible');
      popupVisible = true;
    });
    
    // Add elements to the page
    document.body.appendChild(popup);
    document.body.appendChild(minimizeButton);
  }
  
  // Hide the popup
  function hidePopup() {
    if (popup) {
      popup.classList.add('hidden');
      popupVisible = false;
      
      // Show minimize button
      if (minimizeButton) {
        minimizeButton.classList.add('visible');
      }
    }
  }
  
  // Observe URL changes for single-page applications
  function observeUrlChanges() {
    let lastUrl = location.href;
    
    // Create an observer instance
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        currentUrl = lastUrl;
        
        // Check if the new URL is in memories
        checkIfMemoryExists(currentUrl);
      }
    });
    
    // Start observing
    observer.observe(document, { subtree: true, childList: true });
  }
  
  // Initialize when the page is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
