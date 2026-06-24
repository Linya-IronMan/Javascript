import Button from "./components/button/index";
import ButtonTemplate from "./components/button/button.template";

const components = {
  Button,
};

const template = {
  Button: ButtonTemplate,
};

Object.values(components).forEach((component) => {
  customElements.define(component.name, component);
});

// const templateContainer = documet.createElement("template");

// Object.keys(template).forEach(templateKey => {
//   const templateContainer = documet.createElement("template");
//   templateContainer.id = templateKey;
//   .innerHTML =
// })
