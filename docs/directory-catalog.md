# 目录索引

## Promise 与异步

| 目录 | 入口 | 说明 |
| --- | --- | --- |
| `01-Promise.all` | `main.js`、`test.js` | 手写或验证 `Promise.all` 行为。 |
| `02-Promise.race` | `main.js` | 验证 `Promise.race` 行为。 |
| `03-Promise：简单实现` | `class.js`、`cache.js`、`index.html` | Promise 简易实现和浏览器验证页面。 |
| `04-Promise：异步并发限制器` | `index.js` | 异步并发控制实验。 |
| `05-Promise：then实验` | `main.js` | `then` 调用链与状态流转实验。 |
| `18-Promise.allSettled` | `index.html` | `Promise.allSettled` 浏览器示例。 |
| `35-workerqueue` | `index.ts`、`worker.ts`、`index.html` | Worker 队列与异步任务调度示例。 |
| `36-PromiseInterface` | `index.js` | Promise 接口形态相关实验。 |

## 函数、对象与语言机制

| 目录 | 入口 | 说明 |
| --- | --- | --- |
| `07-call,bind,apply实现` | `call_and_apply.ts`、`bind.ts`、`fn.test.ts` | 手写 `call`、`apply`、`bind`，并配有测试。 |
| `08-Currying` | `curry.ts`、`curry.test.ts` | 函数柯里化实现与测试。 |
| `11-new操作符` | `index.ts`、`new.test.ts` | 手写 `new` 操作符行为。 |
| `13-Reflect` | `mian.html` | `Reflect` API 浏览器实验。 |
| `14-this指向` | 多个 HTML | 普通函数、箭头函数、对象方法中的 `this` 指向实验。 |
| `15-toString,valueOf调用时机` | `main.js` | 对象隐式转换调用时机实验。 |
| `21-getType 获取类型` | `index.ts`、`index.test.ts` | 类型判断工具实现与测试。 |
| `24-instanceof` | `instanceof.ts`、`instanceof.test.ts` | 手写 `instanceof` 行为。 |
| `31-toString-valueOf` | `index.js` | `toString` / `valueOf` 补充实验。 |
| `37-bit-mask` | `index.js`、`index.html` | 位掩码用法实验。 |
| `41-ESModule` | `引用传递/main.js` | ES Module 引用传递行为实验。 |

## 数据结构与手写工具

| 目录 | 入口 | 说明 |
| --- | --- | --- |
| `20-数组扁平化` | `index.ts`、`index.test.ts` | 数组扁平化实现与测试。 |
| `23-LazyMan` | `lazyman.ts` | LazyMan 链式任务调度实现。 |
| `25-EventBus` | `eventbus.ts`、`evenbus-split-on-once.ts`、`eventbus.test.ts` | 事件总线实现，包含 `on` / `once` 等能力。 |
| `26-LRU-CacheMem` | `LRU.ts`、`_LRU.ts`、`LRU.test.ts` | LRU 缓存实现与测试。 |
| `27-deep-clone` | `deepclone.ts`、`_deepclone.ts`、`deepclone.test.ts` | 深拷贝实现与测试。 |
| `32-array-reduce` | `index.js` | `Array.prototype.reduce` 相关实验。 |

## 浏览器、DOM 与 CSS

| 目录 | 入口 | 说明 |
| --- | --- | --- |
| `06-跨域` | `跨域cookie.html` | 跨域 cookie 行为实验。 |
| `09-DOM-Event-Stream` | `index.html` | DOM 事件流实验。 |
| `10-EvevtLoop` | `main.html` | 浏览器 Event Loop 示例。 |
| `12-nodejs-EventLoop` | `main.js`、`main2.js`、`main3.js` | Node.js Event Loop 行为示例。 |
| `17-ES11-动态import模块引入` | `index.html`、`app.js`、`hello.js` | 动态 `import()` 示例。 |
| `22-dom-traverse` | `dom-traverse.ts`、`index.html` | DOM 遍历示例，根项目 `npm run start` 指向这里。 |
| `29-CSS3-transition-animation` | `index.html` | CSS transition / animation 示例。 |
| `30-text-ellipsis` | `index.html` | 文本省略效果示例。 |
| `33-rect-select` | `index.html` | 矩形框选交互示例。 |
| `34-wheel2Resize` | `index.html`、`bg.jpeg` | 滚轮缩放图片示例。 |

## 框架、组件与工程化

| 目录 | 入口 | 说明 |
| --- | --- | --- |
| `16-状态机` | `fsm.js`、`index.js`、`webpack.config.js` | 状态机实验，包含本地 JSON 数据。 |
| `17-vue-function-prop` | `prop-func` | Vue 函数 props 示例。 |
| `19-设计模式` | `单例模式/index.js` | 单例模式示例。 |
| `28-WASM-HelloWorld-Rust` | `hello-wasm`、`my-rust-wasm`、`my-vue-app` | Rust / WASM / Vue 综合实验。 |
| `40-ThreeTemplate` | `index.ts`、`index.html` | Three.js 模板项目。 |
| `41-inversify` | `index.ts`、`inversify/config.ts` | InversifyJS 依赖注入示例。 |
| `kor-copy` | `index.ts`、`components/*` | Lit 风格组件复制 / 改造实验。 |
| `WebComponent` | 多个子目录 | 原生 WebComponent、Webpack Template、Polymer、Lit 实验集合。 |

## 空目录或待补充目录

扫描时发现以下目录暂无有效源码或仅包含构建缓存，建议后续补代码或清理：

- `37-ts-decorator`
- `38-Canvas`
- `39-CommonEventListener`

其中 `39-CommonEventListener` 当前只发现缓存 / 构建产物目录，没有可读源码入口。
