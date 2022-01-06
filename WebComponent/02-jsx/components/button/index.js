class MyButton extends HTMLElement {
  static name = "my-button";
  constructor() {
    super();
    this.innerHTML = MyButton.name;
  }
}

console.log(MyButton.name, "==== my buatton name ");
export default MyButton;
