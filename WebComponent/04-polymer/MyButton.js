// import {
//     PolymerElement,
//     html,
// } from "./node_modules/@polymer/polymer/polymer-element.js";

import { PolymerElement, html } from "@polymer/polymer";

export default class MyButton extends PolymerElement {
    static get properties() {
        return { mood: String };
    }
    static get template() {
        return html `
      <style>
        .mood {
          color: green;
        }
      </style>
      Web Components are <span class="mood">[[mood]]</span>!
    `;
    }
}

customElements.define("my-button", MyButton);