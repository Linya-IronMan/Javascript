import { html, LitElement, TemplateResult } from "./node_modules/lit/index.js";
import { customElement } from "./node_modules/lit/decorators.js";

class MinimalView extends LitElement {
    render() {
        return html `<h1>My View</h1>`;
    }
}

customElement.define("my-component", MinimalView);

export default MinimalView;