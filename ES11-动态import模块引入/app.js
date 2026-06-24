// import hello from "./hello.js" 

const btn = document.getElementById("btn")

btn.onclick = function() {
  import("./hello.js").then(module => {
    console.log("module ====", module)
    module.hello();
  })
}
