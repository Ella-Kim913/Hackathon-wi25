// For reference & future usage
// In this test, doing nothing

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "HTML_RETRIEVED") {
        console.log("Received HTML:", message.html);

        // Process or send the HTML to a backend server for updates
        // For example:
        // fetch('https://your-backend-api.com/process', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ html: message.html })
        // });

        sendResponse({ status: "HTML received" });
    }
});
