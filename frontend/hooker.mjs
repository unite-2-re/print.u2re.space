const where = document.querySelector("body > pre");
if (where && where.innerHTML) {
    const filename = location.pathname;
    const ext = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
    if (ext == "md") {
        chrome.runtime.sendMessage({ action: "hook", doc: where.innerText });
    }
}
