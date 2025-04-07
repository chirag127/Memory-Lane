document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const bookmarkForm = document.getElementById('bookmark-form');
  const existingBookmark = document.getElementById('existing-bookmark');
  const noteInput = document.getElementById('note');
  const takeSnapshotCheckbox = document.getElementById('take-snapshot');
  const tagInput = document.getElementById('tag-input');
  const tagList = document.getElementById('tag-list');
  const saveBtn = document.getElementById('save-btn');
  const updateBtn = document.getElementById('update-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const viewAllBtn = document.getElementById('view-all-btn');
  const savedDate = document.getElementById('saved-date');
  const savedNote = document.getElementById('saved-note');
  const savedTags = document.getElementById('saved-tags');

  // Current URL and bookmark data
  let currentUrl = '';
  let currentBookmark = null;
  let currentTags = [];

  // Initialize popup
  function initPopup() {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        currentUrl = tabs[0].url;
        checkIfBookmarked(currentUrl);
      }
    });

    // Set up event listeners
    saveBtn.addEventListener('click', saveBookmark);
    updateBtn.addEventListener('click', updateBookmark);
    deleteBtn.addEventListener('click', deleteBookmark);
    viewAllBtn.addEventListener('click', openMemoriesPage);
    tagInput.addEventListener('keydown', handleTagInput);
  }

  // Check if the current URL is already bookmarked
  function checkIfBookmarked(url) {
    chrome.storage.local.get('memories', (data) => {
      const memories = data.memories || {};
      
      if (memories[url]) {
        // URL is already bookmarked
        currentBookmark = memories[url];
        currentTags = currentBookmark.tags || [];
        showExistingBookmark();
      } else {
        // URL is not bookmarked yet
        showBookmarkForm();
      }
    });
  }

  // Show the bookmark form for new bookmarks
  function showBookmarkForm() {
    bookmarkForm.classList.remove('hidden');
    existingBookmark.classList.add('hidden');
  }

  // Show existing bookmark details
  function showExistingBookmark() {
    bookmarkForm.classList.add('hidden');
    existingBookmark.classList.remove('hidden');
    
    // Format date
    const bookmarkDate = new Date(currentBookmark.timestamp);
    const formattedDate = bookmarkDate.toLocaleString();
    
    // Display bookmark details
    savedDate.textContent = `Saved on ${formattedDate}`;
    savedNote.textContent = currentBookmark.note;
    
    // Display tags
    savedTags.innerHTML = '';
    if (currentBookmark.tags && currentBookmark.tags.length > 0) {
      currentBookmark.tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        savedTags.appendChild(tagElement);
      });
    }
  }

  // Handle tag input
  function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const tag = tagInput.value.trim().replace(/,/g, '');
      if (tag && !currentTags.includes(tag)) {
        currentTags.push(tag);
        renderTags();
      }
      
      tagInput.value = '';
    }
  }

  // Render tags in the UI
  function renderTags() {
    tagList.innerHTML = '';
    
    currentTags.forEach((tag, index) => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag';
      tagElement.innerHTML = `
        ${tag}
        <span class="tag-remove" data-index="${index}">×</span>
      `;
      tagList.appendChild(tagElement);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        currentTags.splice(index, 1);
        renderTags();
      });
    });
  }

  // Save a new bookmark
  function saveBookmark() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || !tabs[0]) return;
      
      const tab = tabs[0];
      const url = tab.url;
      const title = tab.title;
      const note = noteInput.value.trim();
      const takeSnapshot = takeSnapshotCheckbox.checked;
      
      // Create bookmark object
      const bookmark = {
        url,
        title,
        note,
        tags: currentTags,
        timestamp: Date.now()
      };
      
      // Take snapshot if requested
      if (takeSnapshot) {
        try {
          bookmark.snapshot = await captureVisibleTab();
        } catch (error) {
          console.error('Failed to capture snapshot:', error);
        }
      }
      
      // Save to storage
      chrome.storage.local.get('memories', (data) => {
        const memories = data.memories || {};
        memories[url] = bookmark;
        
        chrome.storage.local.set({ memories }, () => {
          // Show success message
          saveBtn.textContent = 'Saved!';
          setTimeout(() => {
            saveBtn.textContent = 'Save Memory';
            window.close();
          }, 1500);
        });
      });
    });
  }

  // Update an existing bookmark
  function updateBookmark() {
    showBookmarkForm();
    
    // Pre-fill form with existing data
    noteInput.value = currentBookmark.note || '';
    currentTags = currentBookmark.tags || [];
    renderTags();
    
    // Change save button text
    saveBtn.textContent = 'Update Memory';
  }

  // Delete a bookmark
  function deleteBookmark() {
    if (confirm('Are you sure you want to delete this memory?')) {
      chrome.storage.local.get('memories', (data) => {
        const memories = data.memories || {};
        
        if (memories[currentUrl]) {
          delete memories[currentUrl];
          
          chrome.storage.local.set({ memories }, () => {
            // Show bookmark form after deletion
            currentBookmark = null;
            currentTags = [];
            showBookmarkForm();
          });
        }
      });
    }
  }

  // Open the memories page
  function openMemoriesPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL('memories.html') });
  }

  // Capture visible tab as data URL
  function captureVisibleTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 70 }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(dataUrl);
        }
      });
    });
  }

  // Initialize popup
  initPopup();
});
