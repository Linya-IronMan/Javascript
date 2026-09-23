# AOP 面向切面编程 (TypeScript 实现)

本子项目旨在将 Java **Spring Boot** 框架中的 **AOP (Aspect-Oriented Programming)** 核心概念，在 **TypeScript** 语言体系下进行具象化的代码落地与深度对比。

> 💡 **进阶阅读推荐**：  
> 1. 概念与应用全景：👉 **[什么是 AOP：从第一性原理与生活故事看面向切面编程](./docs/what-is-aop.md)**（含 Mermaid 架构图、机场安检/汉堡包比喻、真实 6 大杀手级场景）  
> 2. 核心专有名词速通：👉 **[一文搞懂 AOP 核心术语：切面、切点、连接点、Target 到底是啥？](./docs/aop-core-concepts-explained.md)**（用巨星演唱会与安保团队故事，搞清 Target/Pointcut/JoinPoint/Weaving）  
> 3. Advice 词源与心智模型：👉 **[深入理解 Advice：为什么 AOP 里的“通知/增强”在英文里叫“建议”？](./docs/what-is-advice.md)**（详解为什么叫建议？大将军与军师出谋划策模型及 1966 年 Lisp 历史）  
> 4. TS 底层语法深度剖析：👉 **[深度剖析 @Around：底层基于什么 TS/JS 语法实现？](./docs/how-around-works.md)**（详解装饰器工厂、属性描述符劫持、闭包、显式 this 与泛型系统）

---

## 一、 AOP 核心概念与 Spring Boot 对照

| AOP 核心概念 | Spring Boot (Java) 对应表现 | TypeScript 落地技术与表现 | 职责说明 |
| :--- | :--- | :--- | :--- |
| **Aspect (切面)** | `@Aspect class LoggingAspect` | 切面类或通知函数集合（如 `LoggingAspect`） | 横切关注点（日志、事务、鉴权等）的模块化封装 |
| **Join Point (连接点)** | `org.aspectj.lang.JoinPoint` | `JoinPoint<TTarget, TArgs, TReturn>` 接口 | 程序执行的特定节点（此处为方法调用上下文） |
| **ProceedingJoinPoint** | `ProceedingJoinPoint.proceed()` | `ProceedingJoinPoint.proceed(overrideArgs?)` | 专用于环绕通知，持有推进原方法执行的控制权 |
| **Pointcut (切入点)** | `@Pointcut("execution(* com..*(..))")` | 装饰器绑定 或 代理工厂的断言函数 `pointcut(methodName)` | 匹配哪些方法需要被切面拦截的表达式或规则 |
| **Advice (通知)** | `@Before`, `@AfterReturning`, `@AfterThrowing`, `@After`, `@Around` | `@Before`, `@AfterReturning`, `@AfterThrowing`, `@After`, `@Around` 装饰器工厂 | 切面在特定连接点触发的具体动作 |
| **Target (目标对象)** | 纯净的 `@Service` Bean（如 `UserServiceImpl`） | 纯净的业务 Service 类（如 `OrderService`） | 包含核心业务逻辑的被代理对象 |
| **Weaving (织入)** | CGLIB / JDK 动态代理在运行期生成代理类 | 1. **装饰器织入**（定义期元编程）<br>2. **Proxy 动态代理织入**（运行期非侵入拦截） | 将切面与业务逻辑合并创建最终可执行对象的过程 |

---

## 二、 架构模式与双织入实现

为了让您能够全方位理解 AOP 在 TypeScript 中的不同呈现方式，本项目实现了两种各具优势的织入模式：

### 模式 1：基于【装饰器 (Decorators)】的声明式织入
> **对标场景**：Spring Boot 中的 `@Transactional`、`@PreAuthorize`、自定义日志注解等声明式开发体验。

- **优势**：语法直观，直接声明在类的方法上，可读性极佳。
- **示例代码**：
  ```typescript
  export class UserService {
    @Around(transactionalAdvice)
    @Around(logAroundAdvice)
    public async createUser(id: string, name: string, email: string): Promise<UserEntity> {
      // 纯净业务代码... 若抛出异常自动触发回滚
    }

    @Before(createAuthorizeAdvice('ADMIN'))
    public deleteUser(id: string): boolean {
      // 只有 ADMIN 角色放行，否则前置通知直接抛出 403 阻断
    }
  }
  ```

---

### 模式 2：基于【动态代理工厂 (Proxy Factory)】的纯净织入
> **对标场景**：Spring 底层 `ProxyFactory`、CGLIB / JDK 动态代理、IoC 容器自动为 Bean 包装代理对象的机制。

- **优势**：**100% 零侵入**。业务 Service 完全不需要引入任何装饰器或框架代码，切面在装配期由工厂统一织入。
- **示例代码**：
  ```typescript
  // 1. 业务类本身保持完全纯净
  const rawOrderService = new OrderService();

  // 2. 运行时动态织入切面链
  const proxiedOrderService = AopProxyFactory.create(rawOrderService, [
    LoggingAspect,
    PerformanceAspect,
    TransactionAspect,
  ]);

  // 3. 调用代理对象，自动触发切面调用链
  await proxiedOrderService.createOrder('ORD-8801', 'U-1001', items);
  ```

---

## 三、 四大实战切面展示

1. **日志切面 (`LoggingAspect`)**：
   - 自动在调用前打印方法名与入参结构；
   - 正常返回时打印返回值；
   - 抛出异常时捕获异常并打印日志。
2. **性能切面 (`PerformanceAspect`)**：
   - 基于 `performance.now()` 计算方法耗时；
   - 耗时超过阈值（如 15ms）自动打印黄色慢调用告警。
3. **事务切面 (`TransactionAspect`)**：
   - 模拟 Spring `@Transactional`；
   - 方法开始前 `begin()` 开启事务并分配事务 ID；
   - 成功执行后 `commit()`；
   - 遭遇任何未捕获异常自动触发 `rollback()`。
4. **安全鉴权切面 (`AuthAspect`)**：
   - 模拟 Spring Security 中的 `@PreAuthorize("hasRole('ADMIN')")`；
   - 从 `SecurityContextHolder` 提取当前用户身份；
   - 角色不满足时阻断方法执行并抛出 `AccessDeniedException`。

---

## 四、 目录结构

```text
aop/
├── package.json               # 独立的子项目配置与运行脚本
├── tsconfig.json              # 开启 experimentalDecorators 的 TS 编译配置
├── README.md                  # 本文档
└── src/
    ├── core/
    │   ├── types.ts           # JoinPoint, ProceedingJoinPoint, Advice 等严格类型定义
    │   ├── decorators.ts      # @Before, @After, @Around 等五大通知装饰器实现
    │   └── proxy-factory.ts   # AopProxyFactory 运行时动态代理织入工厂
    ├── aspects/
    │   ├── logging.aspect.ts      # 日志切面
    │   ├── performance.aspect.ts  # 性能切面（慢方法预警）
    │   ├── transaction.aspect.ts  # 事务切面（自动提交与回滚）
    │   └── auth.aspect.ts         # 权限切面（角色鉴权阻断）
    ├── services/
    │   ├── user.service.ts    # 演示类 1：装饰器式 AOP 业务服务
    │   └── order.service.ts   # 演示类 2：纯净业务服务（动态代理织入）
    └── index.ts               # 端到端运行与控制台生动输出入口
```

---

## 五、 运行指南

在 `aop/` 子目录下或仓库根目录下均可直接执行：

### 1. 方式一：在 `aop` 子目录中执行
```bash
cd aop

# 编译 TypeScript
pnpm build

# 编译并运行完整演示
pnpm start
```

### 2. 方式二：在根目录下通过统一 Demo 启动器执行
```bash
pnpm demo aop
```
