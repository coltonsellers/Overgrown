let activeTab = null;
let startTime = null;
let elapsedTime = 0;
let isTabActive = true;
let timerInterval = null;

// Track tab switches
chrome.tab.onActivated.addListener((activeInfo) => {
    if(activeTabId !== activeInfo.tabId) {
        // Pause timer for previous tab
        pauseTimer();

        // Start the timer for the new tab
        activeTabId = activeInfo.tabId;
        startTime = Date.now();
        startTimer();
    }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.status === 'complete') {
        startTime = Date.now();
        startTimer();
    }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDO_ID_NONE) {
        // Browser was minimized or unfocused
        pauseTimer();
    } else {
        // Regain of focus
        chrome.tabs.query({ active: true, windowId }, (tabs) => {
            if (tabs[0] && tabs[0].id === activeTabId) {
                // Resume timer if same tab as before
                startTimer();
            }
        });
    }
});

// Timer function
function startTimer() {
    if (timerInterval) clearInterval(timerInterval); // Clear existing 
    isTabActive = true;
    startTime = Date.now() - elapsedTime * 1000;
    timerInterval = setInterval(() => {
        if (activeTabId && startTime) {
            elapsedTime = (Date.now() - startTime) / 1000;
            checkSiteAndUpdateVegetation(activeTabId, elapsedTime);
        }
    }, 1000);
}

// Pause timer function
function pauseTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      isTabActive = false;
      chrome.tabs.sendMessage(activeTabId, { action: 'pauseVegetation' });
    }
}

// Check if current site is in the website list
function checkSiteAndUpdateVegetation(tabId, elapsedTime) {
    chrome.storage.sync.get({ sites: [] }, (data) => {
      const sites = data.sites; // Get the list of blocked sites
      chrome.tabs.get(tabId, (tab) => {
        if (tab.url) {
          const site = sites.find((s) => tab.url.includes(s.url)); // Check if the site is blocked
          if (site) {
            const totalTime = site.timer * 60; // Convert minutes to seconds
            const remainingTime = totalTime - elapsedTime;
            const percentage = Math.max(0, (elapsedTime / totalTime) * 100);
  
            if (remainingTime <= 0) {
              // Lock the site if the timer runs out
              chrome.tabs.sendMessage(tabId, { action: 'lockSite' });
            } else if (remainingTime <= 5 * 60) {
              // Update vegetation in the last 5 minutes
              chrome.tabs.sendMessage(tabId, {
                action: 'updateVegetation',
                percentage,
              });
            }
          }
        }
      });
    });
  }

