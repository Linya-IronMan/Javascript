# TypeScript 装饰器全景精讲 (聚焦 AOP 切面实现机制)

本子项目旨在全方位、多维度剖析 **TypeScript 装饰器 (Decorators)** 的完整语法体系与运行原理，并**重点深度拆解 AOP（面向切面编程）中如何运用方法装饰器实现无侵入功能增强**。

> 💡 **核心原理解析精选长文**：  
> 1. 语法全景与 AOP 核心：👉 **[TypeScript 装饰器全景深度指南](./docs/decorator-deep-dive.md)**（洋葱模型 Mermaid 时序图、底层编译真容剖析、AOP 核心机制与小学生手机壳比喻）  
> 2. 深度执行时机专题：👉 **[装饰器的执行时机全解：何时执行？执行几次？与 new 的先后关系](./docs/decorator-lifecycle-timing.md)**（彻底搞懂为什么在类定义时只执行一次、与 new 的时空鸿沟）

---

## 一、 TypeScript 5 大装饰器全览对照表

| 装饰器类型 | 作用目标 | 函数签名 | 核心典型应用场景 |
| :--- | :--- | :--- | :--- |
| **类装饰器 (Class)** | 构造函数本身 | `(target: Function) => void \| Function` | 类似 Spring 的 `@Component`、类冻结 `@Sealed`、依赖注入容器注册 |
| **方法装饰器 (Method)**<br>⭐ **AOP 绝对主角** | 实例/静态方法 | `(target: object, key: string, desc: PropertyDescriptor) => PropertyDescriptor` | **AOP 核心**：日志 `@Log`、耗时 `@MeasureTime`、事务 `@Transactional`、失败自动重试 `@Retry` |
| **属性装饰器 (Property)** | 类的成员属性 | `(target: object, propertyKey: string) => void` | 属性默认值回退 `@DefaultValue`、ORM 字段映射 `@Column`、依赖注入 `@Inject` |
| **访问器装饰器 (Accessor)** | getter / setter | `(target: object, key: string, desc: PropertyDescriptor) => PropertyDescriptor` | 昂贵计算属性缓存 `@CacheResult`、属性懒加载 |
| **参数装饰器 (Parameter)** | 方法的形参 | `(target: object, key: string, paramIndex: number) => void` | 收集形参规则元数据，配合方法装饰器实现入参校验 `@NotNull`、路由取参 `@Param` |

---

## 二、 为什么方法装饰器是 AOP 的唯一真神？

很多初学者疑惑：为什么类装饰器和属性装饰器做不了 AOP？
- 类装饰器只能拿到构造函数，**拿不到单个业务方法的执行体**；
- 属性与参数装饰器**拿不到属性描述符 (`PropertyDescriptor`)**；
- **只有【方法装饰器】能够拿到 `descriptor.value`**：
  通过重写 `descriptor.value`，切面能够在类加载期把原函数捕获到闭包里，并用一个包含前置、后置、异常捕获的新函数取而代之！

---

## 三、 项目源码目录结构

```text
ts-decorator/
├── package.json                    # 独立的子项目配置与运行脚本
├── tsconfig.json                   # 编译配置（启用 experimentalDecorators）
├── .gitignore                      # 忽略 dist/ 与 node_modules/
├── README.md                       # 本说明文档
├── docs/
│   └── decorator-deep-dive.md      # 核心原理深度指南（洋葱模型、底层源码剖析）
└── src/
    ├── 01-class-decorator.ts       # 1. 类装饰器实战 (@Sealed, @Component)
    ├── 02-property-decorator.ts    # 2. 属性与访问器装饰器 (@DefaultValue, @CacheResult)
    ├── 03-parameter-decorator.ts   # 3. 参数装饰器协同校验 (@NotNull + @Validate)
    ├── 04-aop-method-decorator.ts  # 4. ⭐ AOP 方法装饰器精讲 (@Log, @MeasureTime, @Retry)
    ├── 05-execution-order.ts       # 5. 装饰器执行时序洋葱模型大解密
    └── index.ts                    # 全景串联执行入口与控制台生动输出
```

---

## 四、 运行指南

在 `ts-decorator/` 目录下或项目根目录均可直接运行：

### 方式一：在 `ts-decorator` 目录下执行
```bash
cd ts-decorator

# 编译代码
pnpm build

# 编译并运行全景演示
pnpm start
```

### 方式二：在根目录下通过统一启动器执行
```bash
pnpm demo ts-decorator
```
