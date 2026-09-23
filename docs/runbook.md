# 运行指南

## 安装根依赖

```bash
npm install
```

根目录已存在 `package-lock.json`，优先使用 `npm install` 保持锁文件一致。

## 运行根项目示例

```bash
npm run start
```

该命令会执行：

```bash
parcel ./22-dom-traverse/index.html
```

适合查看 `22-dom-traverse` 的 DOM 遍历页面。

## 运行测试

根项目没有显式 `test` 脚本，但已配置 `jest.config.js`。可以直接运行：

```bash
npx jest
```

只跑某个测试文件：

```bash
npx jest 25-EventBus/eventbus.test.ts
```

当前 TypeScript 测试通过 `ts-jest` 运行，测试环境为 Node。

## 打开浏览器类 HTML 示例

很多实验是独立 HTML，可以使用任意静态服务器打开。例如使用 Parcel：

```bash
npx parcel 33-rect-select/index.html
```

也可以直接打开 HTML 文件，但涉及模块加载、动态 import、Worker、WASM 的示例更建议通过本地开发服务器访问，避免浏览器安全策略影响结果。

## 子项目运行方式

### `kor-copy`

```bash
cd kor-copy
npm install
npm run start
```

该子项目使用 `webpack-dev-server --config webpack.dev.config.js`。

### `WebComponent/05-Lit/MinimalLitComponentVite`

```bash
cd WebComponent/05-Lit/MinimalLitComponentVite
npm install
npm run dev
```

构建：

```bash
npm run build
```

### `41-inversify`

```bash
cd 41-inversify
npm install
npm run start
```

注意：该脚本依赖 `ts-node` 命令，但当前子项目 `package.json` 没有显式声明 `ts-node`。如果本机没有全局命令，需要先补充依赖后再运行。

### `40-ThreeTemplate`

该目录有 `three` 依赖和 `index.html` / `index.ts`，但 `package.json` 没有声明脚本。可按静态页面或 Parcel 示例运行：

```bash
cd 40-ThreeTemplate
npm install
npx parcel index.html
```

### `28-WASM-HelloWorld-Rust`

该目录包含多个 WASM 实验：

- `hello-wasm`
- `my-rust-wasm`
- `my-vue-app`

运行前需要本机具备 Rust / wasm-pack / Node 相关环境。建议先阅读各子目录的 `README.md` 和 `Cargo.toml`，确认要运行的是 Rust 包还是 Vue 应用。

## 常见注意事项

- 根目录 `tsconfig.json` 的 `include` 是 `*/**/*`，会覆盖大多数子目录；如果新增大量构建产物，可能影响 TypeScript 扫描。
- `dist`、`.cache`、`.parcel-cache`、子项目 `dist` 等目录是构建产物或缓存，文档索引默认不把它们当作源码入口。
- 仓库中存在多个包管理器锁文件，例如根目录 `package-lock.json`、部分子项目 `yarn.lock` 或 `pnpm-lock.yaml`。进入子项目后优先跟随该子项目已有锁文件选择包管理器。
