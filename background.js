// Retrieving API Credentials from local storage
async function getApiCredentials() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["subscriptionKey", "endpoint", "targetUrl", "key"], (result) => {
            if (result.subscriptionKey && result.endpoint) {
                resolve(result);
            } else {
                resolve(null);
            }
        });
    });
}


// Listen for messages from content.js to generate alt text
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeImage" && message.imageUrl) {
        analyzeImage(message.imageUrl).then((altText) => {
            sendResponse({ altText });
        });
        return true; // Keep the channel open 
    }
});

// Generates and returns alt text for an image using Azure AI
async function analyzeImage(imageUrl) {

    const credentials = await getApiCredentials();
    if (!credentials) {
        return "API credentials are missing.";
    }

    const { subscriptionKey, endpoint } = credentials;

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
        return data.captionResult.text; 
    } catch (error) {
        return "Image description not available";
    }
}

// Listen for messages from content.js to generate accessiblity score
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeAcceScore", message.html) {
        analyzeAccessibility(message.html).then((score) => {
            sendResponse({ score });
        });
        return true; 
    }
});

// Generated an accessibility score for the webpage by prompting ChatGPT
async function analyzeAccessibility(htmlContent) {

    const credentials = await getApiCredentials();
    if (!credentials) {
        return "API credentials are missing.";
    }

    const { targetUrl, key } = credentials;


    const requestBody = {
        messages: [
            {
                role: "system",
                content: "You are an AI assistant that evaluates web pages for accessibility based on WCAG 2.1 standards. Provide an accessibility score (1-10) as Integer format only. Do not include any other value besides score"
            },
            {
                role: "user",
                content: `Analyze the following HTML page for accessibility:\n\n${htmlContent}`
            }
        ]
    };

    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": key,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("API Error:", errorDetails);
            return `Error: ${errorDetails.error?.message || "Failed to generate accessibility score"}`;
        }

        const data = await response.json();
        // const toInt = parseFloat(data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error analyzing accessibility:", error);
        return "Error generating accessibility score.";
    }
}