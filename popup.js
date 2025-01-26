document.getElementById("analyzeButton").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startGeneratingAltText" }, (response) => {

            chrome.storage.local.get(["altTextEnabled"], (result) => {
                console.log(result.altTextEnabled);
                if (result.altTextEnabled) {
                    chrome.storage.local.set({ altTextEnabled: false }, () => {
                    });
                    document.getElementById("power-button").style.backgroundColor = "#B50906";
                    document.getElementById("altTextCount").style.display = "none";
                    document.getElementById("power-button").style.boxShadow = "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 7px 0 rgba(0, 0, 0, 0.19)";
                    return;
                }

                chrome.storage.local.set({ altTextEnabled: true }, () => {
                    // Send message to the active tab to start immediately
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "startGeneratingAltText" });
                    });
                    document.getElementById("power-button").style.backgroundColor = "green";
                    document.getElementById("altTextCount").style.display = "block";
                    document.getElementById("power-button").style.boxShadow = "inset 0 10px 10px 0 rgba(0, 0, 0, 0.2), inset 0 10px 10px 0 rgba(0, 0, 0, 0.2)";
                });
            });

        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getCounterValue" }, (response) => {
            if (response) {
                const numElement = document.querySelector(".numAltText");
                if (numElement) {
                    numElement.innerText = response.counter;
                }
            }
        });
    });
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message === "altTextProcessingDone", message.counter) {
//         console.log("get message");
//         const numElement = document.querySelector(".numAltText");
//         if (numElement) {
//             numElement.innerText = message.counter;
//         }
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["altTextEnabled"], (result) => {
        if (result.altTextEnabled) {
            document.getElementById("power-button").style.backgroundColor = "green";
            document.getElementById("altTextCount").style.display = "block";
            document.getElementById("power-button").style.boxShadow = "inset 0 10px 10px 0 rgba(0, 0, 0, 0.2), inset 0 10px 10px 0 rgba(0, 0, 0, 0.2)";
        } else {
            document.getElementById("power-button").style.backgroundColor = "#B50906";
            document.getElementById("altTextCount").style.display = "none";
            document.getElementById("power-button").style.boxShadow = "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 7px 0 rgba(0, 0, 0, 0.19)";
        }
    })

})


document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getPageHTML" }, (response) => {
            if (response && response.html) {
                // Now request AI analysis from background.js
                requestIAcceScore(response.html).then((score) => {
                    let newScore = parseFloat(score);
                    // newScore = Math.trunc(newScore);
                    // Select the first element with class "scoreText"
                    const scoreElement = document.querySelector(".scoreText");

                    if (scoreElement) {
                        scoreElement.innerText = newScore;
                    }
                });
            }
        });
    });
})





async function requestIAcceScore(html) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "analyzeAcceScore", html }, (response) => {
            if (response && response.score) {
                resolve(response.score);
            } else {
                resolve("Alt text unavailable");
            }
        });
    });
}
