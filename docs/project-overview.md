# 项目总览

## 基本信息

- 仓库名：`JS-Test`
- 根目录：`/Users/linya/Code/Self/Javascript`
- 主要语言：JavaScript、TypeScript、HTML，另包含少量 Rust / Vue / WebComponent 示例。
- 根项目描述：测试和验证 JavaScript 基础特性。
- 根项目测试框架：`jest` + `ts-jest`，测试环境为 Node。

## 技术栈扫描

根项目依赖主要服务于基础实验：

- `jest`、`ts-jest`、`@types/jest`：运行 TypeScript 单元测试。
- `parcel-bundler`：快速启动单个 HTML / TS 浏览器实验。
- `lit`、`@polymer/polymer`：WebComponent 相关实验。
- `json-server`：状态机示例中的本地数据服务相关依赖。
- `esbuild`：现代构建工具实验依赖。

子项目中还包含：

- `kor-copy`：基于 Lit + Webpack 的组件实验。
- `WebComponent/05-Lit/MinimalLitComponentVite`：基于 Vite + Lit 的组件实验。
- `40-ThreeTemplate`：Three.js 模板实验。
- `41-inversify`：InversifyJS 依赖注入示例。
- `28-WASM-HelloWorld-Rust`：Rust 编译到 WASM，并在 Vue / Web 中使用的实验。

## 代码组织方式

仓库大体分为四类：

1. 编号实验目录：如 `01-Promise.all`、`25-EventBus`、`27-deep-clone`，通常每个目录只关注一个知识点。
2. 主题集合目录：如 `WebComponent`、`28-WASM-HelloWorld-Rust`，内部包含多个阶段或子项目。
3. 独立子项目：如 `kor-copy`、`40-ThreeTemplate`、`41-inversify`，有自己的 `package.json` 或构建方式。
4. 根配置：`package.json`、`tsconfig.json`、`jest.config.js`，用于统一测试和部分示例运行。

## 根项目配置

`jest.config.js`：

```js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
};
```

`tsconfig.json`：

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "outDir": "dist"
    },
    "include": ["*/**/*"]
}
```

根项目当前只有一个脚本：

```bash
npm run start
```

它会通过 Parcel 打开 `22-dom-traverse/index.html`。

## 当前测试覆盖

已发现的测试文件包括：

- `07-call,bind,apply实现/fn.test.ts`
- `08-Currying/curry.test.ts`
- `11-new操作符/new.test.ts`
- `20-数组扁平化/index.test.ts`
- `21-getType 获取类型/index.test.ts`
- `24-instanceof/instanceof.test.ts`
- `25-EventBus/eventbus.test.ts`
- `26-LRU-CacheMem/LRU.test.ts`
- `27-deep-clone/deepclone.test.ts`

另有 `01-Promise.all/test.js` 和 `03-Promise：简单实现/test.html`，更偏向手动或浏览器实验。
