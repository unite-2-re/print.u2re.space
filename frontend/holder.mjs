const tabMap = new Map();

//
(async () => {
    //const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    //const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
    // do something with response here, not outside the function
    //console.log(response);

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (sender?.tab?.id) {
                if (request?.action == "hook") {
                    tabMap.set(sender.tab.id, request.doc);
                    chrome.tabs.update(sender.tab.id, { url: "https://print.u2re.space/" });
                }

                //
                if (request?.action == "load") {
                    sendResponse(tabMap.get(sender.tab.id));
                    tabMap.delete(sender.tab.id);
                }
            };
        }
    );
})();
