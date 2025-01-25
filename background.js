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


const subscriptionKey = "CIK5iGNxyw58wVrmyDV7AGYGXnXgK5qZmRClUaWWjWEI3tltwHCQJQQJ99BAACYeBjFXJ3w3AAAFACOG6k9D";
const endpoint = "https://visiontestingforhackathon.cognitiveservices.azure.com";


const targetUrl = "https://ai-ghyeon9518ai025573802926.openai.azure.com/openai/deployments/gpt-35-turbo-16k/chat/completions?api-version=2024-08-01-preview";
const key = "M57JDoo06CkzMCqxlVY7nCzM3Pn00B3iK8UWMbmeH2JNWJblYDQ0JQQJ99BAACHYHv6XJ3w3AAAAACOGJd8B"

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeImage" && message.imageUrl) {
        analyzeImage(message.imageUrl).then((altText) => {
            sendResponse({ altText });
        });
        return true; // Keep the channel open for async response
    }
});

async function analyzeImage(imageUrl) {
    const url = `${endpoint}/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2024-02-01`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: imageUrl })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return `Error: ${errorDetails.error?.message || "Failed to generate alt text"}`;
        }

        const data = await response.json();
        return data.captionResult.text; // Extracts generated caption
    } catch (error) {
        return "Image description not available";
    }
}
