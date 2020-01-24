var tabId, clacks;

chrome.tabs.query(
    {active: true, lastFocusedWindow: true},
    function(tabs) {

        if (!tabs || !tabs.length) return;

        tabId = tabs[0].id;
        
        chrome.runtime.getBackgroundPage(
            function(bg) {
                clacks = bg.getClacks(tabId);
                document.getElementById("text").textContent = "Clacks are sending " + clacks;
            }
        );
    }
);
