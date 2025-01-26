// sets counter var for num of alt text generated
let counter = 0;

// Enables image processing
chrome.storage.local.get(["altTextEnabled"], (result) => {
    if (result.altTextEnabled) {
        processImages();
    }
});

// Send request to determine URL validity
async function requestImageAnalysis(imageUrl) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "analyzeImage", imageUrl }, (response) => {
            if (response && response.altText) {
                resolve(response.altText);
            } else {
                resolve("Alt text unavailable");
            }
        });
    });
}

// Finds images with an empty/no alt text tag and appends generated alt text
async function processImages() {
    const images = document.querySelectorAll("img:not([alt]), img[alt='']");

    for (let img of images) {
        const imageURL = img.src
        try {
            await checkImageUrl(imageURL);

            // Attempt to fetch the image
            const response = await fetch(imageURL);

            if (!response.ok) {
                continue; // Skip this image
            }

            // Convert response to a blob
            const fileImg = await response.blob();

            if (fileImg.size > 50) {
                if (fileImg.size > 20971520) {
                    // compress (future implementation)
                }
                const altText = await requestImageAnalysis(imageURL);
                img.alt = altText;
                counter++;
                console.log(`Updated alt text: ${altText}`);
            } else {
                console.log("Image must be compressed");
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (counter > 0) {
        console.log("sending message");
        chrome.runtime.sendMessage({
            action: "altTextProcessingDone",
            count: counter,
        });
    }
}

// Validates the image URL
function checkImageUrl(imageURL) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
            resolve();
        }
    })
}

// Listen to start generating alt text
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startGeneratingAltText") {
        processImages();
    }
});

// Listen fto send the web page's HTML
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageHTML") {
        sendResponse({ html: document.documentElement.outerHTML });
    }
});

// Sends the counter value to the pop-up
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getCounterValue") {
        sendResponse({ counter }); 
    }
});

// Sends request for accessibility score generation 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAccessibilityScore") {
        analyzeAccessibility(fullPageHTML).then(score => sendResponse({ score }));
    }
});
