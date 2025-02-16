let tabsData = {};
let activeTabId = null;

function sendMessageToTab(tabId, message) {
  console.log(`Sending message to tab ${tabId}:`, message);
  chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.id === tabId) {
      chrome.tabs.sendMessage(tabId, message);
    }
  });
}

// Track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab switched:', activeInfo);
  if (activeTabId !== activeInfo.tabId) {
    if (tabsData[activeTabId]) {
      // Pause timer for previous tab
      console.log(`Pausing timer for tab ${activeTabId}`);
      pauseTimer(activeTabId);
    }

    // Start timer for new active tab
    activeTabId = activeInfo.tabId;
    console.log(`Starting timer for new active tab ${activeTabId}`);
    startTimer(activeTabId);
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab updated: ${tabId}`, changeInfo, tab);
  if (tabId === activeTabId && changeInfo.status === 'complete') {
    console.log(`Starting timer for updated tab ${tabId}`);
    startTimer(tabId);
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log(`Window focus changed: ${windowId}`);
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser was minimized or unfocused
    console.log(`Pausing timer for unfocused window on tab ${activeTabId}`);
    pauseTimer(activeTabId);
  } else {
    // Regain of focus
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0] && tabs[0].id === activeTabId) {
        // Resume timer for the same tab as before
        console.log(`Resuming timer for refocused window on tab ${activeTabId}`);
        startTimer(activeTabId);
      }
    });
  }
});

// Start timer for a tab
function startTimer(tabId) {
  console.log(`Starting timer for tab ${tabId}`);
  if (!tabsData[tabId]) {
    tabsData[tabId] = {
      startTime: Date.now(),
      elapsedTime: 0,
      isTabActive: true,
      timerInterval: null
    };
  }
  const tabData = tabsData[tabId];
  tabData.isTabActive = true;
  tabData.startTime = Date.now() - tabData.elapsedTime * 1000;

  if (tabData.timerInterval) clearInterval(tabData.timerInterval);
  tabData.timerInterval = setInterval(() => {
    tabData.elapsedTime = (Date.now() - tabData.startTime) / 1000;
    console.log(`Elapsed time for tab ${tabId}: ${tabData.elapsedTime}`);
    checkSiteAndUpdateVegetation(tabId, tabData.elapsedTime);
  }, 1000);
}

// Pause timer for a tab
function pauseTimer(tabId) {
  console.log(`Pausing timer for tab ${tabId}`);
  const tabData = tabsData[tabId];
  if (tabData) {
    clearInterval(tabData.timerInterval);
    tabData.timerInterval = null;
    tabData.isTabActive = false;
    sendMessageToTab(tabId, { action: "pauseVegetation" });
  }
}

// Check if current site is in the website list
function checkSiteAndUpdateVegetation(tabId, elapsedTime) {
  console.log(`Checking site and updating vegetation for tab ${tabId} with elapsed time ${elapsedTime}`);
  chrome.storage.sync.get({ sites: [] }, (data) => {
    const sites = data.sites;
    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url) {
        const site = sites.find((s) => tab.url.includes(s.url));
        if (site) {
          const totalTime = site.timer * 60;
          const remainingTime = totalTime - elapsedTime;
          const percentage = Math.max(0, (elapsedTime / totalTime) * 100);

          console.log(`Site found: ${site.url}, remaining time: ${remainingTime}, percentage: ${percentage}`);

          if (remainingTime <= 0) {
            console.log(`Time's up for site ${site.url}, locking site.`);
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

// Listen for start timer message from React component
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  if (message.action === "START_TIMER") {
    const { website, index } = message;
    chrome.storage.sync.get({ sites: [] }, (data) => {
      const sites = [...data.sites, website];
      chrome.storage.sync.set({ sites }, () => {
        // Set timer data for the website
        if (!tabsData[activeTabId]) {
          tabsData[activeTabId] = {
            startTime: Date.now(),
            elapsedTime: 0,
            isTabActive: true,
            timerInterval: null,
            totalTime: website.duration * 60
          };
        }
        console.log(`Starting timer for new website ${website.title}`);
        startTimer(activeTabId);
      });
    });
  }
});
