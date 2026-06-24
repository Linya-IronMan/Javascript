class MyComp extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = "Hello World"
    }
}

window.customElements.define("my-component", MyComp)

export default MyComp