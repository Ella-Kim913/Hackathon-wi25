document.getElementById("analyzeButton").addEventListener("click", () => {
    if (document.getElementById("power-button").style.backgroundColor == "green") {
        document.getElementById("power-button").style.backgroundColor = "#B50906";
        document.getElementById("altTextCount").style.display = "none";
    } else {
        document.getElementById("power-button").style.backgroundColor = "green";
        document.getElementById("altTextCount").style.display = "block";

    }


    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startGeneratingAltText" }, (response) => {
            // if (response && response.score) {
            //     document.getElementById("scoreDisplay").innerText = `Score: ${response.score}`;
            // } else {
            //     document.getElementById("scoreDisplay").innerText = "Error retrieving score.";
            // }
        });
    });
});

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
