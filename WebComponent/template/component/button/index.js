import Button from "./components/button/index";
import template from "./button.html";

const components = {
  Button,
};

Object.values(components).forEach((component) => {
  console.log(component);
  customElements.define(component.name, component);
});
