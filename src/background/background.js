let tabsData = {}; 
let activeTabId = null; 
let urlList = []; // Store the URL list 

// Array to store the frame paths
const frames = [];
for (let i = 1; i <= 25; i++) {
  frames.push(chrome.runtime.getURL(`assets/frame${i}.svg`));
}


function sendMessageToTab(tabId, message) {
    console.log(`Sending message to tab ${tabId}:`, message);
  
    // Inject the content script if it's not already running
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).then(() => {
      // Now send the message
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
        } else {
          console.log('Response from content script:', response);
        }
      });
    }).catch((error) => {
      console.error('Failed to inject content script:', error);
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
    // Check if the new tab's URL matches any of the tracked URLs 
    activeTabId = activeInfo.tabId; 
    chrome.tabs.get(activeTabId, (tab) => { 
      if (tab && tab.url) { 
        checkAndStartTimer(activeTabId, tab.url); 
      } 
    }); 
  } 
}); 

// Listen for tab updates 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { 
  console.log(`Tab updated: ${tabId}`, changeInfo, tab); 
  if (tabId === activeTabId && changeInfo.status === 'complete') { 
    checkAndStartTimer(tabId, tab.url); 
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
        checkAndStartTimer(activeTabId, tabs[0].url); 
      } 
    }); 
  } 
}); 

// Check if URL is in list and start timer if it is 
function checkAndStartTimer(tabId, url) { 
  const site = urlList.find((s) => url.includes(s.url)); 
  if (site) { 
    console.log(`Starting timer for tab ${tabId} with URL ${url}`); 
    startTimer(tabId); 
  } else { 
    console.log(`No matching URL found for tab ${tabId} with URL ${url}`); 
    pauseTimer(tabId); // Ensure any previous timer is paused 
  } 
} 

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

// Check if current site is in the website list, and perform frame addition functions
let frameInterval = null;
let currentFrameIndex = 0;

function checkSiteAndUpdateVegetation(tabId, elapsedTime) {
  console.log(`Checking site and updating vegetation for tab ${tabId} with elapsed time ${elapsedTime}`);
  chrome.tabs.get(tabId, (tab) => {
    const site = urlList.find((s) => tab.url.includes(s.url));
    if (site) {
      const totalTime = site.timer * 60;
      const remainingTime = totalTime - elapsedTime;
      const percentage = Math.max(0, (elapsedTime / totalTime) * 100);
      console.log(`Site found: ${site.url}, remaining time: ${remainingTime}, percentage: ${percentage}`);
      const minutesLeft = Math.max(0, Math.ceil(remainingTime / 60));
      chrome.storage.local.set({ [`timeLeft_${site.url}`]: minutesLeft });

      if (remainingTime <= 0) {
        console.log(`Time's up for site ${site.url}, locking site.`);
        sendMessageToTab(tabId, { action: "lockSite" });
        clearInterval(frameInterval); // Clear the interval if the time is up
        frameInterval = null;
        currentFrameIndex = 0;
      } else if (totalTime < 600) { // If total time is less than 10 minutes
        if (!frameInterval) {
          console.log(`Total time is less than 10 minutes for site ${site.url}, starting vegetation update.`);
          const frameIntervalTime = (totalTime * 1000) / 25; // Spread 20 frames evenly across total time
          frameInterval = setInterval(() => {
            if (currentFrameIndex <= 25) {
              sendMessageToTab(tabId, {
                action: "updateVegetation",
                percentage,
                frameIndex: currentFrameIndex,
                framePath: frames[currentFrameIndex], // Send the frame path
              });
              currentFrameIndex++;
            } else {
              clearInterval(frameInterval); // Stop the interval after 20 frames
              frameInterval = null;
              currentFrameIndex = 0;
            }
          }, frameIntervalTime);
        }
      } else if (remainingTime <= 600 && !frameInterval) { // If total time is 10 minutes or more
        console.log(`10 minutes left for site ${site.url}, starting vegetation update.`);
        frameInterval = setInterval(() => {
          if (currentFrameIndex <= 25) {
            sendMessageToTab(tabId, {
              action: "updateVegetation",
              percentage,
              frameIndex: currentFrameIndex,
              framePath: frames[currentFrameIndex], // Send the frame path
            });
            currentFrameIndex++;
          } else {
            clearInterval(frameInterval); // Stop the interval after 20 frames
            frameInterval = null;
            currentFrameIndex = 0;
          }
        }, 30000); // 30 seconds interval
      }
    }
  });
}

// Listen for messages from the React component 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
  console.log('Received message:', message); 
  if (message.type === "addWebsite") { 
    // Add new website to the urlList 
    const newWebsite = { 
      url: message.website, 
      timer: parseInt(message.timeLeft, 10) || 0, // Assuming timeLeft is in minutes 
    }; 
    urlList.push(newWebsite); 
    console.log('New website added:', newWebsite); 
    console.log('Updated URL list:', urlList); 
  } else if (message.type === "updateWebsites") { 
    // Update the urlList with the new list from the React component 
    urlList = message.websites.map((website) => ({ 
      url: website.title, 
      timer: parseInt(website.timeLeft, 10) || 0, // Assuming timeLeft is in minutes 
    })); 
    console.log('URL list updated:', urlList); 
  } 
});
