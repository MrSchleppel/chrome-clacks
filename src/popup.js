var tabId, clacks;
var textAnimation;

chrome.tabs.query(
    {active: true, lastFocusedWindow: true},
    function(tabs) {

        if (!tabs || !tabs.length) return;

        tabId = tabs[0].id;
        
        chrome.runtime.getBackgroundPage(
            function(bg) {
                clacks = bg.getClacks(tabId);
                document.getElementById("text").textContent = "";

                var letterIndex = 0;
                var interval = 666;
                bg.restartAnimation(clacks, tabId);
                textAnimation = setInterval(function() {
                    document.getElementById("text").textContent += clacks[letterIndex];

                    letterIndex++;
                    if (letterIndex > clacks.length) {
                        document.getElementById("text").textContent = "";
                        letterIndex=0;
                    }
                
                }, interval);
            }
        );
    }
);
