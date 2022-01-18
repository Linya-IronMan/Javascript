import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createPopper } from "@popperjs/core";

/**
 * An example element.
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("lit-tooltip")
export class ToolTip extends LitElement {
  static styles = css``;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = "World";

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  @property({ type: Boolean })
  isToolTipShow = false;

  @property({ type: String })
  input = "";

  // ['tooltip-container', !this.isToolTip ? "display-none" : 'display-block']

  get tooltipClass(): string {
    return [
      "tooltip-container",
      !this.isToolTipShow ? "display-none" : "display-block",
    ].join(" ");
  }

  render() {
    return html`
      <div class="${this.tooltipClass}">
        <slot name="tooltip"> This is the tooltip </slot>
      </div>
    `;
  }

  private _onClick(e: MouseEvent) {
    console.log(this, "_onClick log");
    const target = e.target as HTMLElement;
    const tooltip = target.children[0] as HTMLElement;
    this.isToolTipShow = true;
    createPopper(target, tooltip, {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 0],
          },
        },
        {
          name: "arrow",
          options: {},
        },
      ],
    });
  }

  foo(): string {
    return "foo";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-tooltip": ToolTip;
  }
}
