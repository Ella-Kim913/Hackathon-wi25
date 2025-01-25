document.getElementById("analyzeButton").addEventListener("click", () => {
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