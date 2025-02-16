chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'lockSite') {
        // Logic to lock the site, such as displaying a blocking overlay
        document.body.innerHTML = '<div style="background-color: black; color: white; font-size: 3em; text-align: center; height: 100vh; display: flex; justify-content: center; align-items: center;">This site is locked</div>';
        console.log('Site locked');
    } else if (request.action === 'updateVegetation') {
        // Logic to update vegetation, such as animating an overlay
        document.body.innerHTML = `<div style="background-color: green; color: white; font-size: 3em; text-align: center; height: 100vh; display: flex; justify-content: center; align-items: center;">Vegetation: ${request.percentage}%</div>`;
        console.log(`Vegetation updated: ${request.percentage}%`);
    } else if (request.action === 'pauseVegetation') {
        // Logic to pause vegetation updates
        console.log('Vegetation paused');
    }
    sendResponse({ status: 'done' });
});
