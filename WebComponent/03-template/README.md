# WebComponent - template

- [参考：MDN-WebComponent-temppalte&slot](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_templates_and_slots)

```html
<template id="template">
    <span>Hello World slot tempalte </span>
</template>
```
template 中的内容默认情况下是不会展示在你的页面中，虽然在html结构中能够找到它
![](images/template-html-not-show.png)

直到使用JavaScript获取它的引用，然后添加到DOM中
```javascript
    const template = document.querySelector("#template");
    document.body.appendChild(template.content);
```
- 注意：appendChild 参数是 `template.content`


## 问题
- [ ] 这种方法貌似很难直接应用于 WebComponent 的组件开发之中去? 
  - 如何引入这些template就是一个大问题。
    实际上查到了一个 `HTML imports ` 本来或许可以解决这个问题，但是很可惜，这个特性貌似要删除了

- [ ] 貌似和`fragment` 的作用有点相似？ 可以用于存储部分节点，在需要的时候将其渲染。只是 `template` 存储的节点是可以在 html 结构中看到的
- [ ] 网上看见有描述说，template 的特性可以用于开发SPA应用
- [ ] Vue 这些组件库中是否有应用到 template 的特性？ vue中的template是否和这个有关？
- [ ] 或许可以写一个 loader 处理 temp 文件，将temp文件添加id，添加到html中去，就类似Vue那样 SFC 的写法来书写WebComponent组件？
- [ ] 或许可以

# slot
这个标签除了IE不支持，其他的都支持

> HTML `<slot>` 元素 ，作为 Web Components 技术套件的一部分，是Web组件内的一个占位符。该占位符可以在后期使用自己的标记语言填充，这样您就可以创建单独的DOM树，并将它与其它的组件组合在一起。

