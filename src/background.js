var clacks = {};
var animation;

function getClacks(tabId) {
    return clacks[tabId];
};

function extinguishClacksIcon(tabId) {
    chrome.pageAction.hide(tabId)
    chrome.pageAction.setIcon(
        {
            "tabId": tabId,
            "path": {
                "19": chrome.extension.getURL("images/Clacks19/Clacks-Blank-small.png"),
                "38": chrome.extension.getURL("images/Clacks38/Clacks-Blank.png")
            }
        });
}

function illuminateClacksIcon(clacks, tabId) {
    clearInterval(animation);
    chrome.pageAction.show(tabId);
    var letterIndex = 0;
    var interval = 450;

    animation = setInterval(function() {
        var _str = "Blank";
        if (letterIndex == clacks.length) _str = "Blank";
        else if (clacks[letterIndex] == ' ') _str = "SPACE";
        else if(clacks[letterIndex]) _str = clacks[letterIndex].toUpperCase();

        chrome.pageAction.setIcon(
            {
                "tabId": tabId,
                "path": {
                    "19": chrome.extension.getURL("images/Clacks19/Clacks-" + _str + "-small.png"),
                    "38": chrome.extension.getURL("images/Clacks38/Clacks-" + _str + ".png")
                }
            });

        letterIndex++;
        if (letterIndex > clacks.length) letterIndex = 0;
    }, interval);
    
}

function restartAnimation(clacks, tabId){
    clearInterval(animation);
    illuminateClacksIcon(clacks, tabId);
}

chrome.webRequest.onCompleted.addListener(
    function(details) {
        var newClacks,
            pattern = /^(X-)?(Clacks-Overhead)$/i;

        if (details.tabId >= 0) {

            newClacks = details.responseHeaders.filter(function(header) {
                    return pattern.test(header.name);
                }).map(function(header) {
                    return header.value;
                }).join("\n");

            if (newClacks) {
                clacks[details.tabId] = newClacks;
                illuminateClacksIcon(newClacks, details.tabId);
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);


chrome.webNavigation.onCommitted.addListener(
    function(details) {
        if (details.transitionType !== "auto_subframe") {
            delete clacks[details.tabId];
            extinguishClacksIcon(details.tabId);
        }
    }
);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var tabId = sender.tab.id;

        if (request.clacks) {
            if (clacks[tabId]) clacks[tabId] += "\n" + request.clacks;
            else clacks[tabId] = request.clacks;
        }

        if (clacks[tabId]) illuminateClacksIcon(clacks, tabId);
});


chrome.tabs.onRemoved.addListener(function (tabId) {
    if (clacks[tabId]) {
        delete clacks[tabId];
    }
});
