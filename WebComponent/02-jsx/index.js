import Button from "./components/button/index";

const components = {
  Button,
};

Object.values(components).forEach((component) => {
  console.log(component);
  customElements.define(component.name, component);
});
