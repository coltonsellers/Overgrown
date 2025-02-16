// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "lockSite") {
      // Logic to lock the site, such as displaying a blocking overlay
      document.body.innerHTML =
        '<div style="background-color: black; color: white; font-size: 3em; text-align: center; height: 100vh; display: flex; justify-content: center; align-items: center;">This site is locked</div>';
      console.log("Site locked");
    } else if (request.action === "updateVegetation") {
      // Logic to update vegetation with the frame
      const { framePath } = request;
      updateFrame(framePath); // Update the frame
      console.log(`Vegetation updated with frame: ${framePath}`);
    } else if (request.action === "pauseVegetation") {
      // Logic to pause vegetation updates
      console.log("Vegetation paused");
    }
    sendResponse({ status: "done" });
  });
  
  // Function to update the frame
  function updateFrame(framePath) {
    let frameContainer = document.getElementById("vegetation-frame");
    if (!frameContainer) {
        frameContainer = document.createElement("div");
        frameContainer.id = "vegetation-frame";
        frameContainer.style.position = "fixed";
        frameContainer.style.top = "0";
        frameContainer.style.left = "0";
        frameContainer.style.width = "100vw";
        frameContainer.style.height = "100vh";
        frameContainer.style.zIndex = "100000000";
        frameContainer.style.pointerEvents = "none"; 
        document.body.appendChild(frameContainer);
    }

    fetch(framePath)
        .then((response) => response.text())
        .then((svgContent) => {
            console.log("SVG Content Loaded");
            frameContainer.innerHTML = svgContent;

            const svgElement = frameContainer.querySelector("svg");
            if (svgElement) {
                svgElement.style.width = "100vw";
                svgElement.style.height = "100vh";
                svgElement.style.position = "absolute";
                svgElement.style.top = "0";
                svgElement.style.left = "0";

                // Get original SVG dimensions
                const originalWidth = svgElement.width.baseVal.value || 1000;
                const originalHeight = svgElement.height.baseVal.value || 1000;

                // Calculate the aspect ratio
                const screenAspectRatio = window.innerWidth / window.innerHeight;
                const svgAspectRatio = originalWidth / originalHeight;

                // Adjust viewBox to match screen aspect ratio
                if (screenAspectRatio > svgAspectRatio) {
                    // Screen is wider than the SVG
                    const newWidth = originalHeight * screenAspectRatio;
                    svgElement.setAttribute("viewBox", `0 0 ${newWidth} ${originalHeight}`);
                } else {
                    // Screen is taller than the SVG
                    const newHeight = originalWidth / screenAspectRatio;
                    svgElement.setAttribute("viewBox", `0 0 ${originalWidth} ${newHeight}`);
                }

                // Make sure it maintains proper proportions
                svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
            }
        })
        .catch((error) => {
            console.error("Failed to load SVG frame:", error);
        });
}