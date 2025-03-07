// @ts-ignore
import { For } from "solid-js";
import { render } from "solid-js/web";
import html from "solid-js/html";
import { hooked } from "./Utils"
import { marked } from "marked";

// @ts-ignore
import { observeContentBox } from "/externals/lib/dom.js";



//
export const getDir = (dest)=>{
    if (typeof dest != "string") return dest;

    //
    dest = dest?.trim?.() || dest;
    if (!dest?.endsWith?.("/")) { dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest; };
    const p1 = !dest?.trim()?.endsWith("/") ? (dest+"/") : dest;
    return (!p1?.startsWith("/") ? ("/"+p1) : p1);
}

//
const $useFS$ = async() => {
    // @ts-ignore
    const opfs = await import(/*@vite-ignore */ '/externals/vendor/happy-opfs.mjs').catch(console.warn.bind(console));

    // @ts-ignore
    const deno = typeof Deno != "undefined" ? Deno : null;

    /* @vite-ignore */
    const ignore = "" + "";
    /* @vite-ignore */
    let node = null;
    if (!opfs?.isOPFSSupported?.()) {
        try {
            node = await import(/*@vite-ignore */ ignore + "node:fs/promises").catch(console.warn.bind(console));
        } catch(e) {
            console.warn(e);
        }
    }

    //
    const fs = opfs?.isOPFSSupported?.() ? opfs : (deno ?? node ?? opfs);
    return fs;
}

//
let currentFS: any = null;
export const useFS = ()=>{ return (currentFS ??= $useFS$()); };
export const provide = async (req: string | Request = "", rw = false) => {
    const url: string = (req as Request)?.url ?? req;
    const path = getDir(url?.replace?.(location.origin, "")?.trim?.());
    const fn   = url?.split("/")?.at?.(-1);

    //
    if (!URL.canParse(url) && path?.trim()?.startsWith?.("/user")) {
        const fs = await useFS();
        const $path = path?.replace?.("/user/", "")?.trim?.();
        const clean = (($path?.split?.("/") || [$path])?.filter?.((p)=>!!p?.trim?.()) || [""])?.join?.("/") || "";
        const npt = ((clean && clean != "/") ? "/" + clean + "/" : clean) || "/";

        //
        if (npt && npt != "/") { await fs?.mkdir?.(npt); };
        if (rw) {
            return {
                write(data) {
                    return fs?.writeFile?.(npt + fn, data);
                }
            }
        }

        //
        const handle = await fs?.readFile?.(npt + fn, {encoding: "blob"});

        //
        let file = null;
        try { file = handle?.unwrap?.() ?? handle; } catch(e) {};
        return file;
    } else {
        return fetch(req).then(async (r) => {
            const blob = await r.blob();
            const lastModified = Date.parse(r.headers.get("Last-Modified") || "") || 0;
            return new File([blob], url.substring(url.lastIndexOf('/') + 1), {
                type: blob.type,
                lastModified
            });
        });
    }
    return null;
};





// while: tab.component should be  ()=> html`...`
export const PrintApp = () => {
    const markdown = hooked(null);

    //
    const requestFileAccess = async (dest = "/user/temp/", current?: any)=>{
        const $e = "showOpenFilePicker";

        // @ts-ignore
        const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("/externals/polyfill/showOpenFilePicker.mjs"))?.[$e];
        return showOpenFilePicker({
            types: [
                {
                    description: "wallpaper",
                    accept: {
                        "text/*": [".md"],
                    },
                },
            ],
            multiple: false,
        })?.then?.(async ([handle] = [])=>{
            const file = await handle?.getFile?.();
            loadMarkdown(file);
        });
    }


    //
    const dragOverHandle = (ev)=>{
        ev?.preventDefault?.();
    }

    //
    const loadMarkdown = async (file: string|File|Blob|Response)=>{
        renderMarkdown(file);
        if (file instanceof File || file instanceof Blob) {
            (await provide("/user/temp/view.md", true) as any)?.write?.(file);
        };
    }

    //
    const dropHandle = (ev)=>{
        ev?.preventDefault?.();
        const file = ev?.dataTransfer?.files?.[0];
        if (file) loadMarkdown(file);
    }

    //
    document.addEventListener("ext-set-md", (ev)=>{
        loadMarkdown(ev?.detail?.doc);
    });

    //
    let once = false;

    //
    const setHTML = async (doc: string|Promise<string> = "")=>{
        markdown.innerHTML = (await doc) || markdown.innerHTML;
        if (!once) document.dispatchEvent(new CustomEvent("ext-ready", {}));
        once = true;
    }

    //
    const renderMarkdown = (file: string|File|Blob|Response)=>{
        if (typeof file == "string") {
            setHTML(marked(file));
        } else 
        if (file instanceof File || file instanceof Blob || file instanceof Response) {
            file?.text()?.then?.((doc)=>setHTML(marked(doc)));
        }
    }

    //
    const contentBox = (element)=>{
        observeContentBox(element, (box)=>{
            element.style.setProperty("--fit-width", Math.min((box.inlineSize - 64), 1200) || 800);
        });
    }

    //
    const preload = ()=>{
        requestIdleCallback(async ()=>{
            const file: any = await provide("/user/temp/view.md");
            if (file) { renderMarkdown(file); } else { setHTML(""); };
        });
    }

    //
    /*  data-theme="light" data-scheme="solid" data-chroma="0.05" data-chroma="1" data-alpha="1" data-highlight="2" */
    return html`<div class="adl-main" id="print-app" style="pointer-events: auto; background-color: transparent;" data-print-pass>
        <nav>
            <div class="row">
                <button data-highlight="2" data-highlight-hover="3" class="open-file" on:click=${()=>requestFileAccess()}><ui-icon icon="notebook-text"></ui-icon></button>
            </div>
            <div class="row">
                
            </div>
        </nav>
        <main ref=${contentBox} data-print-pass data-scheme="solid" data-theme="light" on:drop=${dropHandle} on:dragover=${dragOverHandle}>
            <div ref=${preload} ref=${markdown} data-print id="markdown" ></div>
        </main>
    </div>`;
};

//
export default PrintApp;
export const renderInPage = (root: HTMLElement/*, tasks: any*/)=>{
    render(()=>html`<${PrintApp}><//>`, root);
}
