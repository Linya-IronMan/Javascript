class MyButton extends HTMLButtonElement {
  static name = "my-button";
  shadow = null;

  constructor() {
    super();
    this.shadow = this.attachInternals({ mode: "close" });
  }
}

export default MyButton;
