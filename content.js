
let counter = 0;

chrome.storage.local.get(["altTextEnabled"], (result) => {
    if (result.altTextEnabled) {
        processImages();
    }
});

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


async function processImages() {
    const images = document.querySelectorAll("img:not([alt]), img[alt='']");

    for (let img of images) {
        const imageURL = img.src
        try {
            await checkImageUrl(imageURL);
            const fileImg = await fetch(imageURL).then(r => r.blob());

            if (fileImg.size > 50) {
                if (fileImg.size > 20971520) {
                    // compress it
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

    // if (counter > 0) {
    //     console.log("sending message");
    //     chrome.runtime.sendMessage({
    //         action: "altTextProcessingDone",
    //         count: counter,
    //     });
    // }
}

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startGeneratingAltText") {
        processImages();
    }
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageHTML") {
        sendResponse({ html: document.documentElement.outerHTML });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getCounterValue") {
        sendResponse({ counter }); // Send the counter value to the popup
    }
});




function checkImageUrl(imageURL) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
            resolve();
        }
    })
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAccessibilityScore") {
        analyzeAccessibility(fullPageHTML).then(score => sendResponse({ score }));
        //return true; // Keep the message channel open for async response
    }
});
