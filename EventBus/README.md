# EventBus 自定义事件总线

## 项目说明

实现一个简化版 EventBus，支持事件绑定、一次性事件、事件解绑和事件触发。

## 涉及知识点

- 发布订阅模式
- 回调函数管理
- `on` / `once` / `off` / `emit`
- TypeScript 类设计
- Jest mock function

## 文件说明

| 文件 | 说明 |
|---|---|
| `eventbus.ts` | 基础 EventBus 实现 |
| `evenbus-split-on-once.ts` | 拆分 once 处理逻辑的实现 |
| `eventbus.test.ts` | 单元测试 |

## 快速启动

```bash
npm run demo -- eventbus
```

也可以使用编号启动：

```bash
npm run demo -- 25
```

## 核心思路

内部使用对象维护事件名和回调列表之间的关系。每个回调项除了保存函数本身，还保存是否只执行一次的标记。

触发事件时，依次执行对应事件名下的回调。对于 `once` 事件，执行后从列表中移除。

## 测试说明

测试覆盖：

- 绑定并触发事件
- 解绑单个回调
- 解绑某类事件全部回调
- `once` 回调只触发一次

## 总结

EventBus 是理解发布订阅模式、组件通信和事件系统设计的基础实验。
