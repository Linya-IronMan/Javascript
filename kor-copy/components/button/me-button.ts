import { LitElement, css, html } from "lit";
import { property, state } from "lit/decorators";
import { sharedStyles } from "../../shared-styles";
import "../icon";

type ButtonType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text";

export class meButton extends LitElement {
  @property({ type: String, reflect: true }) type: ButtonType = "primary";

  render() {
    return html`
      <button>
        <slot name="default">button click</slot>
      </button>
    `;
  }
}

if (!window.customElements.get("me-button")) {
  window.customElements.define("me-button", meButton);
}
