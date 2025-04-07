document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const memoriesContainer = document.getElementById('memories-container');
  const searchInput = document.getElementById('search-input');
  const filterType = document.getElementById('filter-type');
  const tagSelect = document.getElementById('tag-select');
  const dateFrom = document.getElementById('date-from');
  const dateTo = document.getElementById('date-to');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const gridViewBtn = document.getElementById('grid-view-btn');
  const listViewBtn = document.getElementById('list-view-btn');
  const timelineViewBtn = document.getElementById('timeline-view-btn');
  const filterTagOption = document.querySelector('.filter-tag');
  const filterDateOption = document.querySelector('.filter-date');
  const emptyState = document.querySelector('.empty-state');
  
  // Variables
  let allMemories = [];
  let filteredMemories = [];
  let allTags = new Set();
  let currentView = 'grid';
  
  // Initialize
  function init() {
    loadMemories();
    setupEventListeners();
  }
  
  // Load all memories from storage
  function loadMemories() {
    chrome.storage.local.get('memories', (data) => {
      const memories = data.memories || {};
      
      // Convert object to array and sort by timestamp (newest first)
      allMemories = Object.values(memories).sort((a, b) => b.timestamp - a.timestamp);
      filteredMemories = [...allMemories];
      
      // Extract all unique tags
      allMemories.forEach(memory => {
        if (memory.tags && memory.tags.length) {
          memory.tags.forEach(tag => allTags.add(tag));
        }
      });
      
      // Populate tag select
      populateTagSelect();
      
      // Display memories
      displayMemories(filteredMemories);
    });
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', handleSearch);
    
    // Filter type change
    filterType.addEventListener('change', handleFilterTypeChange);
    
    // Tag filter change
    tagSelect.addEventListener('change', applyFilters);
    
    // Date filter change
    dateFrom.addEventListener('change', applyFilters);
    dateTo.addEventListener('change', applyFilters);
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // View buttons
    gridViewBtn.addEventListener('click', () => changeView('grid'));
    listViewBtn.addEventListener('click', () => changeView('list'));
    timelineViewBtn.addEventListener('click', () => changeView('timeline'));
  }
  
  // Populate tag select dropdown
  function populateTagSelect() {
    // Clear existing options except the first one
    while (tagSelect.options.length > 1) {
      tagSelect.remove(1);
    }
    
    // Add tags as options
    Array.from(allTags).sort().forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagSelect.appendChild(option);
    });
  }
  
  // Handle search input
  function handleSearch() {
    applyFilters();
  }
  
  // Handle filter type change
  function handleFilterTypeChange() {
    const filterValue = filterType.value;
    
    // Show/hide appropriate filter options
    filterTagOption.classList.toggle('hidden', filterValue !== 'tag');
    filterDateOption.classList.toggle('hidden', filterValue !== 'date');
    
    applyFilters();
  }
  
  // Apply all filters
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterType.value;
    
    // Start with all memories
    let filtered = [...allMemories];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(memory => 
        memory.title.toLowerCase().includes(searchTerm) || 
        memory.url.toLowerCase().includes(searchTerm) || 
        (memory.note && memory.note.toLowerCase().includes(searchTerm)) ||
        (memory.tags && memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }
    
    // Apply type-specific filters
    if (filterValue === 'tag' && tagSelect.value) {
      filtered = filtered.filter(memory => 
        memory.tags && memory.tags.includes(tagSelect.value)
      );
    } else if (filterValue === 'date') {
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(memory => new Date(memory.timestamp) >= fromDate);
      }
      
      if (dateTo.value) {
        const toDate = new Date(dateTo.value);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(memory => new Date(memory.timestamp) <= toDate);
      }
    }
    
    // Update filtered memories and display
    filteredMemories = filtered;
    displayMemories(filteredMemories);
  }
  
  // Clear all filters
  function clearFilters() {
    searchInput.value = '';
    filterType.value = 'all';
    tagSelect.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    
    filterTagOption.classList.add('hidden');
    filterDateOption.classList.add('hidden');
    
    filteredMemories = [...allMemories];
    displayMemories(filteredMemories);
  }
  
  // Change view mode
  function changeView(viewType) {
    currentView = viewType;
    
    // Update active button
    gridViewBtn.classList.toggle('active', viewType === 'grid');
    listViewBtn.classList.toggle('active', viewType === 'list');
    timelineViewBtn.classList.toggle('active', viewType === 'timeline');
    
    // Update container class
    memoriesContainer.className = `${viewType}-view`;
    
    // Redisplay memories in the new view
    displayMemories(filteredMemories);
  }
  
  // Display memories based on current view
  function displayMemories(memories) {
    // Clear container
    memoriesContainer.innerHTML = '';
    
    // Show empty state if no memories
    if (memories.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p>No memories found.</p>
        <p>Try adjusting your filters or search terms.</p>
      `;
      memoriesContainer.appendChild(emptyState);
      return;
    }
    
    // Display based on view type
    if (currentView === 'timeline') {
      displayTimelineView(memories);
    } else {
      // Grid or list view
      memories.forEach(memory => {
        const memoryCard = createMemoryCard(memory);
        memoriesContainer.appendChild(memoryCard);
      });
    }
  }
  
  // Display memories in timeline view
  function displayTimelineView(memories) {
    // Group memories by date
    const groupedMemories = groupMemoriesByDate(memories);
    
    // Create timeline groups
    Object.keys(groupedMemories).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
      const dateMemories = groupedMemories[date];
      
      // Create timeline group
      const timelineGroup = document.createElement('div');
      timelineGroup.className = 'timeline-group';
      
      // Add date header
      const dateHeader = document.createElement('div');
      dateHeader.className = 'timeline-date';
      dateHeader.textContent = formatDate(date);
      timelineGroup.appendChild(dateHeader);
      
      // Add memories container
      const timelineMemories = document.createElement('div');
      timelineMemories.className = 'timeline-memories';
      
      // Add memory cards
      dateMemories.forEach(memory => {
        const memoryCard = createMemoryCard(memory);
        timelineMemories.appendChild(memoryCard);
      });
      
      timelineGroup.appendChild(timelineMemories);
      memoriesContainer.appendChild(timelineGroup);
    });
  }
  
  // Group memories by date (YYYY-MM-DD)
  function groupMemoriesByDate(memories) {
    const groups = {};
    
    memories.forEach(memory => {
      const date = new Date(memory.timestamp);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(memory);
    });
    
    return groups;
  }
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    // Check if date is today or yesterday
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // Format date based on how recent it is
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return date.toLocaleDateString(undefined, options);
    }
  }
  
  // Create a memory card element
  function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    
    // Format date
    const memoryDate = new Date(memory.timestamp);
    const formattedDate = memoryDate.toLocaleString();
    
    // Create tags HTML
    let tagsHtml = '';
    if (memory.tags && memory.tags.length) {
      tagsHtml = memory.tags.map(tag => `<div class="memory-card-tag">${tag}</div>`).join('');
    }
    
    // Create card content based on view type
    if (currentView === 'list') {
      card.innerHTML = `
        <div class="memory-card-snapshot">
          ${memory.snapshot ? `<img src="${memory.snapshot}" alt="Page snapshot">` : '<div class="no-snapshot">No snapshot</div>'}
        </div>
        <div class="memory-card-details">
          <div class="memory-card-header">
            <div class="memory-card-title">${memory.title || 'Untitled'}</div>
            <div class="memory-card-url">${memory.url}</div>
          </div>
          <div class="memory-card-content">
            <div class="memory-card-date">${formattedDate}</div>
            <div class="memory-card-note">${memory.note || 'No notes'}</div>
            <div class="memory-card-tags">${tagsHtml}</div>
          </div>
          <div class="memory-card-actions">
            <button class="memory-card-btn visit-btn" data-url="${memory.url}">Visit</button>
            <button class="memory-card-btn edit-btn" data-url="${memory.url}">Edit</button>
            <button class="memory-card-btn delete-btn" data-url="${memory.url}">Delete</button>
          </div>
        </div>
      `;
    } else {
      // Grid view
      card.innerHTML = `
        ${memory.snapshot ? `
          <div class="memory-card-snapshot">
            <img src="${memory.snapshot}" alt="Page snapshot">
          </div>
        ` : ''}
        <div class="memory-card-header">
          <div class="memory-card-title">${memory.title || 'Untitled'}</div>
          <div class="memory-card-url">${memory.url}</div>
        </div>
        <div class="memory-card-content">
          <div class="memory-card-date">${formattedDate}</div>
          <div class="memory-card-note">${memory.note || 'No notes'}</div>
          <div class="memory-card-tags">${tagsHtml}</div>
        </div>
        <div class="memory-card-actions">
          <button class="memory-card-btn visit-btn" data-url="${memory.url}">Visit</button>
          <button class="memory-card-btn edit-btn" data-url="${memory.url}">Edit</button>
          <button class="memory-card-btn delete-btn" data-url="${memory.url}">Delete</button>
        </div>
      `;
    }
    
    // Add event listeners to buttons
    setTimeout(() => {
      const visitBtn = card.querySelector('.visit-btn');
      const editBtn = card.querySelector('.edit-btn');
      const deleteBtn = card.querySelector('.delete-btn');
      
      visitBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: memory.url });
      });
      
      editBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: memory.url }, (tab) => {
          // Send message to open popup for editing
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action: 'openPopup' });
          }, 1000);
        });
      });
      
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this memory?')) {
          deleteMemory(memory.url);
        }
      });
    }, 0);
    
    return card;
  }
  
  // Delete a memory
  function deleteMemory(url) {
    chrome.storage.local.get('memories', (data) => {
      const memories = data.memories || {};
      
      if (memories[url]) {
        delete memories[url];
        
        chrome.storage.local.set({ memories }, () => {
          // Reload memories
          loadMemories();
        });
      }
    });
  }
  
  // Initialize
  init();
});
