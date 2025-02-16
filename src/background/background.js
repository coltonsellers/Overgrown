let activeTab = null;
let startTime = null;
let elapsedTime = 0;
let isTabActive = true;
let timerInterval = null;
let activeTabId = null;

function sendMessageToTab(tabId, message) {
  chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.id === tabId) {
          chrome.tabs.sendMessage(tabId, message);
      }
  });
}

// Track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
    if(activeTabId !== activeInfo.tabId) {
        // Pause timer for previous tab
        pauseTimer();

        // Start the timer for the new tab
        activeTabId = activeInfo.tabId;
        startTime = Date.now();
        startTimer();
        console.log('tab switch');
    }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.status === 'complete') {
        startTime = Date.now();
        startTimer();
        console.log('tab update');
    }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // Browser was minimized or unfocused
        console.log('minimized');
        pauseTimer();
    } else {
        // Regain of focus
        chrome.tabs.query({ active: true, windowId }, (tabs) => {
            if (tabs[0] && tabs[0].id === activeTabId) {
                // Resume timer if same tab as before
                startTimer();
                console.log('refocussed');
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
            console.log(`Elapsed Time: ${elapsedTime} seconds`); // Log elapsed time
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
      if (activeTabId) {
          sendMessageToTab(activeTabId, { action: "pauseVegetation" });
          console.log('pause timer');

      }
  }
}

// Check if current site is in the website list
function checkSiteAndUpdateVegetation(tabId, elapsedTime) {
  chrome.storage.sync.get({ sites: [] }, (data) => {
      const sites = data.sites;
      chrome.tabs.get(tabId, (tab) => {
          if (tab && tab.url) {
              const site = sites.find((s) => tab.url.includes(s.url));
              if (site) {
                  const totalTime = site.timer * 60;
                  const remainingTime = totalTime - elapsedTime;
                  const percentage = Math.max(0, (elapsedTime / totalTime) * 100);

                  if (remainingTime <= 0) {
                      sendMessageToTab(tabId, { action: "lockSite" });
                  } else if (remainingTime <= 5 * 60) {
                      sendMessageToTab(tabId, {
                          action: "updateVegetation",
                          percentage,
                      });
                  }
              }
          }
      });
  });
}