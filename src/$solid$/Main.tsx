// @ts-ignore
import { For } from "solid-js";
import { render } from "solid-js/web";
import html from "solid-js/html";
import { hooked } from "./Utils"
import { marked } from "marked";

// while: tab.component should be  ()=> html`...`
export const Workspace = () => {
    const markdown = hooked(null);

    //
    const dragOverHandle = (ev)=>{
        ev?.preventDefault?.();
    }

    //
    const dropHandle = (ev)=>{
        ev?.preventDefault?.();
        const file = ev?.dataTransfer?.files?.[0];
        file?.text()?.then?.((doc)=>{
            renderMarkdown(doc);
        });
    }

    //
    const renderMarkdown = (doc: string)=>{
        markdown.innerHTML = marked(doc);
    }

    //
    return html`<>
        <nav>
            <div class="row">
                <button class="open-file"><ui-icon icon="notebook-text"></ui-icon></button>
            </div>
            <div class="row">
                
            </div>
        </nav>
        <main data-print-pass data-scheme="solid" data-theme="light" on:drop=${dropHandle} on:dragover=${dragOverHandle}>
            <div ref=${markdown} data-print id="markdown" ></div>
        </main>
    </>`;
};

//
export default Workspace;
export const renderInPage = (root: HTMLElement/*, tasks: any*/)=>{
    render(()=>html`<${Workspace}><//>`, root);
}
