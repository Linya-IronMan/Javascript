/**
 * @fileoverview AOP 核心类型定义
 * 包含连接点 (JoinPoint)、环绕连接点 (ProceedingJoinPoint)、五大通知 (Advices) 及切面定义。
 * 遵循极严类型守卫规范，杜绝使用 as any。
 */

/**
 * 连接点 (Join Point) 接口
 * 封装方法执行时的上下文信息，对齐 Spring Boot AOP 中的 org.aspectj.lang.JoinPoint
 *
 * @template TTarget 被代理的目标对象类型
 * @template TArgs   目标方法的参数元组类型
 * @template TReturn 目标方法的返回值类型
 */
export interface JoinPoint<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown
> {
  /** 被调用的目标实例 */
  readonly target: TTarget;
  /** 被调用的方法名 */
  readonly methodName: string;
  /** 传入该方法的参数列表 */
  readonly args: TArgs;
}

/**
 * 环绕连接点 (Proceeding Join Point) 接口
 * 继承自 JoinPoint，附带 proceed 执行句柄，对齐 Spring Boot AOP 中的 org.aspectj.lang.ProceedingJoinPoint
 *
 * @template TTarget 被代理的目标对象类型
 * @template TArgs   目标方法的参数元组类型
 * @template TReturn 目标方法的返回值类型
 */
export interface ProceedingJoinPoint<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown
> extends JoinPoint<TTarget, TArgs, TReturn> {
  /**
   * 执行下一个切面通知或最终的目标方法
   *
   * @param overrideArgs 可选的覆盖入参，若提供则以新参数执行后续逻辑
   * @returns 目标方法执行后的结果（支持同步返回值或异步 Promise）
   */
  proceed(overrideArgs?: TArgs): Promise<TReturn> | TReturn;
}

/**
 * 前置通知 (Before Advice) 函数类型
 * 在连接点方法执行之前被调用
 */
export type BeforeAdvice<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[]
> = (joinPoint: JoinPoint<TTarget, TArgs, unknown>) => Promise<void> | void;

/**
 * 后置返回通知 (AfterReturning Advice) 函数类型
 * 在连接点方法成功执行并产生返回值后被调用
 */
export type AfterReturningAdvice<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown
> = (
  joinPoint: JoinPoint<TTarget, TArgs, TReturn>,
  returnValue: TReturn
) => Promise<void> | void;

/**
 * 异常抛出通知 (AfterThrowing Advice) 函数类型
 * 在连接点方法抛出异常时被调用
 */
export type AfterThrowingAdvice<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[]
> = (
  joinPoint: JoinPoint<TTarget, TArgs, unknown>,
  error: Error
) => Promise<void> | void;

/**
 * 最终通知 (After / Finally Advice) 函数类型
 * 无论连接点方法正常结束还是抛出异常，都会在退出时被调用
 */
export type AfterAdvice<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[]
> = (joinPoint: JoinPoint<TTarget, TArgs, unknown>) => Promise<void> | void;

/**
 * 环绕通知 (Around Advice) 函数类型
 * 拥有完全控制权，决定是否执行目标方法、修改参数或返回值
 */
export type AroundAdvice<
  TTarget extends object = object,
  TArgs extends unknown[] = unknown[],
  TReturn = unknown
> = (
  proceedingJoinPoint: ProceedingJoinPoint<TTarget, TArgs, TReturn>
) => Promise<TReturn> | TReturn;

/**
 * 切面 (Aspect) 接口定义
 * 可由多个通知组合而成，用于动态代理工厂
 */
export interface Aspect<TTarget extends object = object> {
  /** 切面名称，便于日志追踪 */
  readonly name: string;
  /** 切入点匹配器：判断指定方法是否需要织入此切面 */
  pointcut?: (methodName: string, target: TTarget) => boolean;
  /** 环绕通知 */
  around?: AroundAdvice<TTarget, unknown[], unknown>;
  /** 前置通知 */
  before?: BeforeAdvice<TTarget, unknown[]>;
  /** 后置返回通知 */
  afterReturning?: AfterReturningAdvice<TTarget, unknown[], unknown>;
  /** 异常通知 */
  afterThrowing?: AfterThrowingAdvice<TTarget, unknown[]>;
  /** 最终通知 */
  after?: AfterAdvice<TTarget, unknown[]>;
}
