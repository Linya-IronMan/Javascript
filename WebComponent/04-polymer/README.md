# 使用 polymer 构建 WebComponent 组件
此文件中是一个简单的demo

实际上我被难住的地方并不是 polymer 的使用，而是 html 中，如何引入 npm 安装的 module？

## 知识点
- 有两种方式可以达到 ESM 引入模块的效果
  - 在 script 标签内部通过 ESM import 语法导入模块
    ```javascript
    <script type="module">
        import MyElement from "./MyButton.js";
    </script>
    ```
- 使用 script 标签的 src 属性
    ```javascript
    <script type="module" src="./MyButton.js"></script>
    ```
- 在引入组件的时候，模块内的所有代码都会执行一遍，可以将 define 定义组件的代码直接写在模块内部，引入即定义


- script 标签使用ESM的方式引入文件，需要注意 script 标签上如果写了 src 属性，那么 script 标签里面的内容就不会再执行

## 重点

主要来自远在实践过程中遇到的两个情况：

---
**情况一**

在 MyButton.js 模块中，最开始使用了常规的包引用方法。
```javascript
import {
    PolymerElement,
    html,
} from "@polymer/polymer";
```

通过 live server 访问 index.html 报错

> Uncaught TypeError: Failed to resolve module specifier "@polymer/polymer". Relative references must start with either "/", "./", or "../".

**问题**
- npm 安装的包为什么不能通过这种方式引用？
- js 包的自动查找机制是属于哪一方，为什么没有自动去 node_module 目录下查找，而是要求使用相对路径的符号开头？
- npm 包管理和 node javascript 的联系是什么？


---

**情况二**

在百般尝试之后，仍无法导入 npm 包的情况下，不得不尝试使用相对路径，手动到 node_module 目录中找到对应模块的入口文件。

```javascript
import {
    PolymerElement,
    html,
} from "./node_modules/@polymer/polymer";
```
像上面那样实际上已经指向了安装的包，但是，仍无法正常导入。

一般导入npm包的时候，都会去读取  package.json 文件中的 main 字段，查找入口文件。我这里也是需要手动加上如果扣文件才能正常导入。

**问题：**

- 读取 package.json 获取入口文件这个习以为常的操作是谁在进行？为什么我这里就完全无法正常使用了？
