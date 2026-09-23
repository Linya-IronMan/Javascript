# JS-Test 文档

本目录是对当前仓库的代码扫描整理，面向“快速找示例、知道怎么跑、知道从哪里继续补”的日常使用场景。

## 文档导航

- [项目总览](./project-overview.md)：仓库定位、技术栈、运行与测试入口。
- [目录索引](./directory-catalog.md)：按主题列出每个实验目录的内容和入口文件。
- [运行指南](./runbook.md)：根项目、子项目、浏览器示例、测试用例的常用命令。
- [主题学习路线](./learning-map.md)：按 Promise、函数机制、数据结构、Web API、WebComponent 等主题串联代码。

## 仓库定位

当前仓库是一个 JavaScript / TypeScript 基础特性与前端技术实验合集，包含：

- Promise、Event Loop、this、call / bind / apply、new、instanceof 等语言机制实验。
- Currying、数组扁平化、深拷贝、EventBus、LRU、LazyMan 等手写实现。
- DOM 事件、跨域 cookie、文本省略、框选、滚轮缩放等浏览器行为示例。
- WebComponent、Lit、Polymer、Three.js、WASM、InversifyJS 等独立技术尝试。

## 维护约定

- 新增实验时，建议继续使用“编号-主题名”的目录命名方式，保持目录可排序。
- 新增可测试的 TypeScript 实现时，建议同时补充 `*.test.ts`，根项目已配置 `jest + ts-jest`。
- 浏览器示例优先保留独立 `index.html`，便于直接用静态服务器或 Parcel / Vite 打开。
- 独立子项目如果需要自己的依赖或命令，保留子目录内 `package.json`，并在 [运行指南](./runbook.md) 里补充入口。

## 文档维护要求

- 本文件只负责导航、范围说明与任务入口，不承载过细的实现细节。
- 新增模块文档后，必须把入口补充到本文件，确保后续任务可以按文档导航进入。
- 目录结构、平台策略、构建方式或交付边界发生变化时，必须同步更新本文件。
- 若某项能力已经从“计划中”进入“已落地”，应及时把对应说明从范围描述迁移到正式规范文档中。
