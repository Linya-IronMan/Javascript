
import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createPopper } from '@popperjs/core';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('multiple-select')
export class MultipleSelect extends LitElement {

  readonly title: string = "";

  static styles = css`
    .display-none {
      display: none;
    }
    .display-block {
      display: block;
    }
    .popperjs-container,
    .tooltip-container {
      width: fit-content;
      background: red;
    }
    .tooltip-container {
      background: blue;
    }
  `

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property({ type: Boolean })
  isToolTipShow = false

  @property({ type: String })
  input = ""

  // ['tooltip-container', !this.isToolTip ? "display-none" : 'display-block']

  get tooltipClass(): string {
    return ['tooltip-container', !this.isToolTipShow ? "display-none" : 'display-block'].join(" ")
  }

  render() {
    return html`
      <div class="popperjs-container" @click="${this._onClick}">
        Hello World
        <div class="${this.tooltipClass}">
          <slot name="tooltip"> 
            This is the tooltip
          </slot>
        </div>
      </div>
    `
  }

  private _onClick(e: MouseEvent) {
    console.log('onClick', this, this.title)
    const target = e.target as HTMLElement;
    const tooltip = target.children[0] as HTMLElement;
    this.isToolTipShow = true
    createPopper(target, tooltip, {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        },
      ],
    });
  }

  foo(): string {
    return 'foo'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'multiple-select': MultipleSelect
  }
}
