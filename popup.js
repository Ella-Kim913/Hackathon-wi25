document.getElementById("analyzeButton").addEventListener("click", () => {
    if (document.getElementById("power-button").style.backgroundColor == "green") {
        document.getElementById("power-button").style.backgroundColor = "#B50906";
    } else {
        document.getElementById("power-button").style.backgroundColor = "green";

    }
    document.getElementById("power-button").style.boxShadow = "0 -2px -3px 0 rgba(0, 0, 0, 0.2), 0 -6px -7px 0 rgba(0, 0, 0, 0.19)";
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