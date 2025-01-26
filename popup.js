document.getElementById("analyzeButton").addEventListener("click", () => {
    if (document.getElementById("power-button").style.backgroundColor == "green") {
        document.getElementById("power-button").style.backgroundColor = "#B50906";
        document.getElementById("altTextCount").style.display = "none";
        document.getElementById("power-button").style.boxShadow = "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 7px 0 rgba(0, 0, 0, 0.19)";
    } else {
        document.getElementById("power-button").style.backgroundColor = "green";
        document.getElementById("altTextCount").style.display = "block";
        document.getElementById("power-button").style.boxShadow = "inset 0 10px 10px 0 rgba(0, 0, 0, 0.2), inset 0 10px 10px 0 rgba(0, 0, 0, 0.2)";

    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startGeneratingAltText" }, (response) => {

            chrome.storage.local.get(["altTextEnabled"], (result) => {
                if (result.altTextEnabled) {
                    chrome.storage.local.set({ altTextEnabled: false }, () => {
                    });
                    return;
                }

                chrome.storage.local.set({ altTextEnabled: true }, () => {
                    // Send message to the active tab to start immediately
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "startGeneratingAltText" });
                    });
                });
            });

        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["altTextEnabled"], (result) => {
        if (result.altTextEnabled) {
            document.getElementById("power-button").style.backgroundColor = "green";
            document.getElementById("altTextCount").style.display = "block";
            document.getElementById("power-button").style.boxShadow = "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 7px 0 rgba(0, 0, 0, 0.19)";
        } else {
            document.getElementById("power-button").style.backgroundColor = "#B50906";
            document.getElementById("altTextCount").style.display = "none";
            document.getElementById("power-button").style.boxShadow = "inset 0 10px 10px 0 rgba(0, 0, 0, 0.2), inset 0 10px 10px 0 rgba(0, 0, 0, 0.2)";

        }
    })

})


document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getPageHTML" }, (response) => {

            if (response && response.html) {
                // Now request AI analysis from background.js
                requestIAcceScore(response.html).then((score) => {
                    console.log(score);
                    let newScore = parseFloat(score);
                    console.log(newScore);
                    newScore = Math.trunc(newScore);
                    console.log(newScore);
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


const pageHTML = document.documentElement.outerHTML

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

requestIAcceScore(pageHTML);
