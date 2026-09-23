/**
 * @fileoverview AOP 动态代理织入工厂 (Proxy Factory)
 * 模拟 Spring Boot 底层 CGLIB / JDK Dynamic Proxy 机制。
 * 允许在无需修改业务类代码（非侵入式）的前提下，将切面链动态织入到目标对象上。
 */

import { Aspect, ProceedingJoinPoint } from './types';
import { isPromiseInstance } from './decorators';

/**
 * AOP 代理工厂类
 * 负责解析切面列表并将目标对象包装为具备切面能力的 Proxy 实例
 */
export class AopProxyFactory {
  /**
   * 为目标对象创建织入了切面的代理实例
   * 对标 Spring 中的 ProxyFactory.getProxy()
   *
   * @template T 被代理的目标对象类型
   * @param target 包含核心业务逻辑的纯净目标对象
   * @param aspects 需要织入的切面集合
   * @returns 拥有横切关注点能力的代理对象
   */
  public static create<T extends object>(target: T, aspects: Aspect<T>[]): T {
    const handler: ProxyHandler<T> = {
      get(targetObj: T, propKey: string | symbol, receiver: unknown): unknown {
        const originalValue = Reflect.get(targetObj, propKey, receiver);

        // 仅对函数调用进行切面拦截，忽略普通属性与内置符号
        if (typeof originalValue !== 'function') {
          return originalValue;
        }

        const methodName = String(propKey);

        // 筛选匹配当前方法切入点 (Pointcut) 的切面
        const matchedAspects = aspects.filter((aspect) => {
          if (!aspect.pointcut) {
            return true;
          }
          return aspect.pointcut(methodName, targetObj);
        });

        // 若无切面命中，直接返回原函数绑定
        if (matchedAspects.length === 0) {
          return originalValue.bind(targetObj);
        }

        // 返回包含切面执行链的高阶代理函数
        return function (...args: unknown[]): unknown {
          return AopProxyFactory.executeAspectChain(
            targetObj,
            methodName,
            args,
            originalValue.bind(targetObj),
            matchedAspects
          );
        };
      },
    };

    return new Proxy(target, handler);
  }

  /**
   * 执行切面拦截链与最终目标方法
   *
   * @template T 目标对象类型
   * @param target 目标对象实例
   * @param methodName 调用的方法名
   * @param args 调用入参
   * @param targetMethod 原目标方法绑定
   * @param aspects 匹配的切面列表
   * @returns 链式调用结果（支持异步与同步）
   */
  private static executeAspectChain<T extends object>(
    target: T,
    methodName: string,
    args: unknown[],
    targetMethod: (...methodArgs: unknown[]) => unknown,
    aspects: Aspect<T>[]
  ): unknown {
    // 递归或从外到内构建 ProceedingJoinPoint 执行链
    const buildPipeline = (index: number): ((currentArgs: unknown[]) => unknown) => {
      if (index >= aspects.length) {
        return (finalArgs: unknown[]) => targetMethod(...finalArgs);
      }

      const aspect = aspects[index];
      const nextProceed = buildPipeline(index + 1);

      return (currentArgs: unknown[]): unknown => {
        const pjp: ProceedingJoinPoint<T, unknown[], unknown> = {
          target,
          methodName,
          args: currentArgs,
          proceed: (overrideArgs?: unknown[]) => {
            const nextArgs = overrideArgs !== undefined ? overrideArgs : currentArgs;
            return nextProceed(nextArgs);
          },
        };

        // 如果切面定义了 Around 通知，完全交由 Around 驱动
        if (aspect.around) {
          return aspect.around(pjp);
        }

        // 否则按 Before -> 目标执行 -> AfterReturning / AfterThrowing -> After 执行
        const executeStandardAdvices = (): unknown => {
          // 1. Before Advice
          if (aspect.before) {
            aspect.before(pjp);
          }

          let executionResult: unknown;
          try {
            executionResult = pjp.proceed(currentArgs);
          } catch (err: unknown) {
            const errorObj =
              err instanceof Error ? err : new Error(typeof err === 'string' ? err : '执行异常');
            if (aspect.afterThrowing) {
              aspect.afterThrowing(pjp, errorObj);
            }
            if (aspect.after) {
              aspect.after(pjp);
            }
            throw errorObj;
          }

          // 异步 Promise 结果处理
          if (isPromiseInstance(executionResult)) {
            return executionResult
              .then(async (resolvedVal) => {
                if (aspect.afterReturning) {
                  await aspect.afterReturning(pjp, resolvedVal);
                }
                return resolvedVal;
              })
              .catch(async (err: unknown) => {
                const errorObj =
                  err instanceof Error
                    ? err
                    : new Error(typeof err === 'string' ? err : '异步执行异常');
                if (aspect.afterThrowing) {
                  await aspect.afterThrowing(pjp, errorObj);
                }
                throw errorObj;
              })
              .finally(async () => {
                if (aspect.after) {
                  await aspect.after(pjp);
                }
              });
          }

          // 同步成功返回
          if (aspect.afterReturning) {
            aspect.afterReturning(pjp, executionResult);
          }
          if (aspect.after) {
            aspect.after(pjp);
          }

          return executionResult;
        };

        return executeStandardAdvices();
      };
    };

    const initialInvoker = buildPipeline(0);
    return initialInvoker(args);
  }
}
