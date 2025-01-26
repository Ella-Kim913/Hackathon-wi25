// Setting API credentials in local storage
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        subscriptionKey: "Azure VisionAI subscriptionKey",
        endpoint: "Azure VisionAI endPoint",

        targetUrl: "Azure OpenAI Target URL",
        key: "Azure OpenAI API Key",
    },);
});