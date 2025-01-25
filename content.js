

// first get the HTML
const pageHTML = document.documentElement.outerHTML

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
                console.log(`Updated alt text: ${altText}`);
            } else {
                console.log("Image must be compressed");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

processImages();

function checkImageUrl(imageURL) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
            resolve();
        }
    })
}



// check the img do not have ALT tag
// if the size of the img is less then 1 ignore
// ignore CROS or unvalid url
// if its too bigger, then need to make it smaller using Canvas



// possible errors
//Error: The image dimension is not allowed to be smaller than 50 and larger than 16000.
//Error: The provided image url is not accessible.

// add the alt tag with the API call - background.js
// update

// get the total number of alt tag updated
// send back to the popup JS



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAccessibilityScore") {
        analyzeAccessibility(fullPageHTML).then(score => sendResponse({ score }));
        return true; // Keep the message channel open for async response
    }
});




// 

