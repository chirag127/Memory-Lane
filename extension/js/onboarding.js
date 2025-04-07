document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const takeSnapshotCheckbox = document.getElementById('take-snapshot');
  const showPopupCheckbox = document.getElementById('show-popup');
  const useWaybackCheckbox = document.getElementById('use-wayback');
  const startBtn = document.getElementById('start-btn');
  
  // Initialize
  function init() {
    // Load current settings
    chrome.storage.local.get('settings', (data) => {
      const settings = data.settings || {
        takeSnapshotByDefault: true,
        showPopupOnRevisit: true,
        useWaybackMachine: true
      };
      
      // Set checkbox states
      takeSnapshotCheckbox.checked = settings.takeSnapshotByDefault;
      showPopupCheckbox.checked = settings.showPopupOnRevisit;
      useWaybackCheckbox.checked = settings.useWaybackMachine;
    });
    
    // Set up event listeners
    takeSnapshotCheckbox.addEventListener('change', updateSettings);
    showPopupCheckbox.addEventListener('change', updateSettings);
    useWaybackCheckbox.addEventListener('change', updateSettings);
    startBtn.addEventListener('click', finishOnboarding);
  }
  
  // Update settings when checkboxes change
  function updateSettings() {
    const settings = {
      takeSnapshotByDefault: takeSnapshotCheckbox.checked,
      showPopupOnRevisit: showPopupCheckbox.checked,
      useWaybackMachine: useWaybackCheckbox.checked
    };
    
    chrome.storage.local.set({ settings });
  }
  
  // Finish onboarding
  function finishOnboarding() {
    // Save settings one last time
    updateSettings();
    
    // Open the memories page
    chrome.tabs.create({ url: chrome.runtime.getURL('memories.html') });
    
    // Close this tab
    window.close();
  }
  
  // Initialize
  init();
});
