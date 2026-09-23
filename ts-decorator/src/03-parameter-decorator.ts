/**
 * @fileoverview 03. 参数装饰器 (Parameter Decorators)
 * 参数装饰器作用于方法的入参上：
 * (target: Object, propertyKey: string | symbol, parameterIndex: number) => void
 *
 * 核心设计原理：
 * 参数装饰器本身不能改变函数的调用流程，但它可以将“第几个参数需要遵循何种规则”记录在元数据集合中。
 * 随后，由配合的方法装饰器（如 @Validate）在调用前读取该元数据，完成真正的非空拦截与入参校验。
 * （这正是 NestJS / Spring Boot 中 @Param / @Valid 的底层通用套路！）
 */

/**
 * 存储方法参数必填索引的元数据映射表
 * Map<targetPrototype, Map<methodName, Set<parameterIndex>>>
 */
const requiredParametersRegistry = new WeakMap<
  object,
  Map<string, Set<number>>
>();

/**
 * 必填参数装饰器 (@NotNull)
 * 标记指定入参在运行时不得传入 null 或 undefined
 *
 * @param target 原型对象
 * @param propertyKey 方法名称
 * @param parameterIndex 参数在形参列表中的索引下标 (0, 1, 2...)
 */
export function NotNull(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number
): void {
  const methodName = String(propertyKey);
  console.log(
    `\x1b[34m[参数装饰器 @NotNull]\x1b[0m 标记方法 [${methodName}] 的第 ${parameterIndex} 位参数为必填项`
  );

  let methodMap = requiredParametersRegistry.get(target);
  if (!methodMap) {
    methodMap = new Map<string, Set<number>>();
    requiredParametersRegistry.set(target, methodMap);
  }

  let paramIndices = methodMap.get(methodName);
  if (!paramIndices) {
    paramIndices = new Set<number>();
    methodMap.set(methodName, paramIndices);
  }

  paramIndices.add(parameterIndex);
}

/**
 * 校验驱动方法装饰器 (@Validate)
 * 读取参数装饰器注册的必填规则，在方法真正执行前进行参数完整性检查
 *
 * @returns 方法装饰器
 */
export function Validate(): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => unknown;
    const methodName = String(propertyKey);

    descriptor.value = function (...args: unknown[]): unknown {
      const methodMap = requiredParametersRegistry.get(target);
      const requiredIndices = methodMap?.get(methodName);

      if (requiredIndices) {
        for (const index of requiredIndices) {
          const val = args[index];
          if (val === undefined || val === null || val === '') {
            throw new Error(
              `[参数校验失败] 调用 [${methodName}] 失败：第 ${index} 位必填参数缺失或为空！`
            );
          }
        }
      }

      console.log(`\x1b[32m[校验通过]\x1b[0m 方法 [${methodName}] 所有 @NotNull 参数校验合格，放行执行 ✅`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 演示用户注册接口
 */
export class UserRegistrationAPI {
  /**
   * 注册账号方法
   *
   * @param username 用户名（必填）
   * @param email 邮箱（必填）
   * @param remark 备注（选填）
   * @returns 注册结果描述
   */
  @Validate()
  public register(
    @NotNull username: string,
    @NotNull email: string,
    remark?: string
  ): string {
    return `用户 [${username} (${email})] 注册成功！备注: ${remark || '无'}`;
  }
}
