(async()=>{

    const doc = await chrome.runtime.sendMessage({ action: "load" });
    document.addEventListener("ext-ready", async ()=>{
        if ( doc ) { document.dispatchEvent(new CustomEvent("ext-set-md", { detail: {doc} })); };
    });
    
})();
