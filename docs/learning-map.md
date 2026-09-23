# 主题学习路线

## Promise 与异步控制

建议顺序：

1. `01-Promise.all`
2. `02-Promise.race`
3. `18-Promise.allSettled`
4. `03-Promise：简单实现`
5. `05-Promise：then实验`
6. `04-Promise：异步并发限制器`
7. `35-workerqueue`

这条线可以从 Promise 静态方法行为，一路看到状态流转、then 链式调用、并发限制和 Worker 队列。

## 函数调用与对象模型

建议顺序：

1. `14-this指向`
2. `07-call,bind,apply实现`
3. `08-Currying`
4. `11-new操作符`
5. `24-instanceof`
6. `21-getType 获取类型`
7. `15-toString,valueOf调用时机`
8. `31-toString-valueOf`

这条线适合理解函数调用上下文、原型链、构造调用和对象隐式转换。

## 数据结构与工具函数

建议顺序：

1. `20-数组扁平化`
2. `27-deep-clone`
3. `25-EventBus`
4. `26-LRU-CacheMem`
5. `23-LazyMan`
6. `32-array-reduce`

这条线覆盖日常面试和业务工具中常见的手写题，也包含测试用例，适合边跑边改。

## 浏览器行为与 DOM

建议顺序：

1. `09-DOM-Event-Stream`
2. `22-dom-traverse`
3. `10-EvevtLoop`
4. `12-nodejs-EventLoop`
5. `06-跨域`
6. `17-ES11-动态import模块引入`
7. `33-rect-select`
8. `34-wheel2Resize`

这条线适合理清浏览器事件、DOM 遍历、事件循环、跨域和交互实现。

## WebComponent 与组件工程

建议顺序：

1. `WebComponent/01-demo`
2. `WebComponent/02-WebPack-Template`
3. `WebComponent/03-template`
4. `WebComponent/04-polymer`
5. `WebComponent/05-Lit`
6. `kor-copy`

这条线从原生 WebComponent 到模板化、Polymer、Lit 和组件复制实验，适合比较不同组件封装方式。

## 现代工程与框架实验

建议顺序：

1. `16-状态机`
2. `17-vue-function-prop`
3. `28-WASM-HelloWorld-Rust`
4. `40-ThreeTemplate`
5. `41-inversify`

这条线覆盖状态机、Vue props、Rust / WASM、Three.js、依赖注入等更独立的专题。

## 后续补文档建议

- 给每个编号目录补一个短 `README.md`，内容固定为“实验目标、入口文件、运行方式、关键结论”。
- 对已有测试的目录补充“测试覆盖点”，例如 `EventBus` 的 `on` / `once` / `off` 行为。
- 对浏览器示例补充截图或 GIF，尤其是 `rect-select`、`wheel2Resize`、Three.js、WebComponent 示例。
- 对 WASM、Lit、Inversify 这类独立子项目补充环境要求，减少后续重新摸索成本。
