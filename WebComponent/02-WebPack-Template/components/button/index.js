import template from "./button.template";
import {
    $_color_primary,
    $_color_success,
    $_color_warn,
    $_color_error,
    $_color_info,
    $_border_base,
    $_border_radius,
} from "../var";
class MyButton extends HTMLParagraphElement {
    static name = "my-button";
    shadow = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
        const container = document.createElement("template");
        container.innerHTML = template;
        this.shadow.appendChild(container.content.cloneNode(true));
    }
}

export default MyButton;