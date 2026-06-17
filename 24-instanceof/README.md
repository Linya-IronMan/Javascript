# instanceof 实现

## 项目说明

手写 `instanceof`，通过原型链判断一个对象是否属于某个构造函数。

## 涉及知识点

- 原型链
- 构造函数 `prototype`
- 对象 `__proto__`
- 基本类型与引用类型判断
- Jest 单元测试

## 文件说明

| 文件 | 说明 |
|---|---|
| `instanceof.ts` | `myInstanceof` 实现 |
| `instanceof.test.ts` | 单元测试 |

## 快速启动

```bash
npm run demo -- instanceof
```

也可以使用编号启动：

```bash
npm run demo -- 24
```

## 核心思路

`instanceof` 的本质是判断构造函数的 `prototype` 是否存在于实例对象的原型链上。

对于非对象、非函数类型，需要直接返回 `false`。

## 总结

该实验适合理解 JavaScript 对象系统、原型链查找和构造函数之间的关系。
