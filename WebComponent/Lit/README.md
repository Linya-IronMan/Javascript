# Lit
Google 用来开发 WebComponet组件的一个辅助工具。

WebComponent 原生组件也是Google最先践行的

https://github.com/web-padawan/awesome-lit#general-resources


这个目录主要就是对 `Lit` 这个辅助 WebComponent开发的工具的探索。

# 问题搜集

- [ ] 这个框架有什么特性
- [ ] 这个工具在哪些方面对 WebComponent 的开发作出了优化
- [ ] 参考之前对 `WebComponent` 原生开发方式的体验，Lit 还有哪些方面可以完善？

# Lit 特性

## 最简单的 Lit Component

- render 函数提供渲染模板
- customElement 定义组件，并声明组件名称

```javascript
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('minimal-view')
class MinimalView extends LitElement {
  render(): TemplateResult {
    return html`<h1>My View</h1>`;
  }
}

export default MinimalView;
```

# 环境
之前比较简单的模块还能使用 html 直接引入package的方式执行。

而现在 Lit 包是一个比较大的模块， 并且还对其他第三方模块进行了依赖，这就不太行了。没办法将所有这样相互依赖的方式转成相对路径的形式供 live server 直接请求。

解决：

- 应该可以使用 vite 试一下。之前写过 Vite，他就是一个静态资源服务器，只是对请求路径进行了修改。利用地柜改成了相对路径的形式。
- 
使用 vite 创建项目的时候貌似有一个 lit

![](images/2022-01-14-00-14-45.png)

---

`ORZ... `  vite 上真的有现成的 Lit 模板，明明两秒之前我还在想自己写一个模板，洗内，被人抢先了！


Lit 的使用直接参考vite模板创建的项目就可以了。
