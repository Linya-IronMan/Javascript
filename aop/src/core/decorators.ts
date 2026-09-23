/**
 * @fileoverview AOP 装饰器织入引擎
 * 提供与 Spring Boot 注解体验高度一致的装饰器：
 * - @Before (前置通知)
 * - @AfterReturning (后置返回通知)
 * - @AfterThrowing (异常抛出通知)
 * - @After (最终通知)
 * - @Around (环绕通知)
 */

import {
  JoinPoint,
  ProceedingJoinPoint,
  BeforeAdvice,
  AfterReturningAdvice,
  AfterThrowingAdvice,
  AfterAdvice,
  AroundAdvice,
} from './types';

/**
 * 判断对象是否为 Promise 实例的类型守卫
 *
 * @template T Promise 解析值的类型
 * @param value 待检测的未知值
 * @returns 是否为 Promise 实例
 */
export function isPromiseInstance<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

/**
 * 环绕通知装饰器工厂 (@Around)
 * 在目标方法执行前后包裹自定义逻辑，持有 ProceedingJoinPoint 控制权。
 * 对标 Spring Boot 中的 @Around("pointcut()")
 *
 * @template TTarget 目标对象的类型
 * @template TArgs   目标方法的入参类型
 * @template TReturn 目标方法的返回值类型
 * @param advice 环绕通知执行函数
 * @returns 标准 TypeScript 方法装饰器
 */
export function Around<
  TTarget extends object,
  TArgs extends unknown[],
  TReturn
>(
  advice: AroundAdvice<TTarget, TArgs, TReturn>
): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      this: TTarget,
      ...args: TArgs
    ) => Promise<TReturn> | TReturn;

    const methodName = String(propertyKey);

    descriptor.value = function (
      this: TTarget,
      ...args: TArgs
    ): Promise<TReturn> | TReturn {
      const pjp: ProceedingJoinPoint<TTarget, TArgs, TReturn> = {
        target: this,
        methodName,
        args,
        proceed: (overrideArgs?: TArgs): Promise<TReturn> | TReturn => {
          const finalArgs = overrideArgs !== undefined ? overrideArgs : args;
          return originalMethod.apply(this, finalArgs);
        },
      };

      return advice(pjp);
    };

    return descriptor;
  };
}

/**
 * 前置通知装饰器工厂 (@Before)
 * 在目标方法执行前触发逻辑。
 * 对标 Spring Boot 中的 @Before("pointcut()")
 *
 * @template TTarget 目标对象的类型
 * @template TArgs   目标方法的入参类型
 * @param advice 前置通知执行函数
 * @returns 标准 TypeScript 方法装饰器
 */
export function Before<TTarget extends object, TArgs extends unknown[]>(
  advice: BeforeAdvice<TTarget, TArgs>
): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      this: TTarget,
      ...args: TArgs
    ) => unknown;

    const methodName = String(propertyKey);

    descriptor.value = function (this: TTarget, ...args: TArgs): unknown {
      const jp: JoinPoint<TTarget, TArgs, unknown> = {
        target: this,
        methodName,
        args,
      };

      const beforeResult = advice(jp);

      if (isPromiseInstance<void>(beforeResult)) {
        return beforeResult.then(() => originalMethod.apply(this, args));
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 后置返回通知装饰器工厂 (@AfterReturning)
 * 在目标方法正常返回并生成返回值后触发。
 * 对标 Spring Boot 中的 @AfterReturning(pointcut = "...", returning = "retVal")
 *
 * @template TTarget 目标对象的类型
 * @template TArgs   目标方法的入参类型
 * @template TReturn 目标方法的返回值类型
 * @param advice 后置返回通知执行函数
 * @returns 标准 TypeScript 方法装饰器
 */
export function AfterReturning<
  TTarget extends object,
  TArgs extends unknown[],
  TReturn
>(
  advice: AfterReturningAdvice<TTarget, TArgs, TReturn>
): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      this: TTarget,
      ...args: TArgs
    ) => Promise<TReturn> | TReturn;

    const methodName = String(propertyKey);

    descriptor.value = function (this: TTarget, ...args: TArgs): unknown {
      const jp: JoinPoint<TTarget, TArgs, TReturn> = {
        target: this,
        methodName,
        args,
      };

      const result = originalMethod.apply(this, args);

      if (isPromiseInstance<TReturn>(result)) {
        return result.then(async (resolvedVal) => {
          await advice(jp, resolvedVal);
          return resolvedVal;
        });
      }

      const afterResult = advice(jp, result);
      if (isPromiseInstance<void>(afterResult)) {
        return afterResult.then(() => result);
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * 异常抛出通知装饰器工厂 (@AfterThrowing)
 * 在目标方法抛出未捕获异常时触发。
 * 对标 Spring Boot 中的 @AfterThrowing(pointcut = "...", throwing = "ex")
 *
 * @template TTarget 目标对象的类型
 * @template TArgs   目标方法的入参类型
 * @param advice 异常抛出通知执行函数
 * @returns 标准 TypeScript 方法装饰器
 */
export function AfterThrowing<
  TTarget extends object,
  TArgs extends unknown[]
>(
  advice: AfterThrowingAdvice<TTarget, TArgs>
): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      this: TTarget,
      ...args: TArgs
    ) => unknown;

    const methodName = String(propertyKey);

    descriptor.value = function (this: TTarget, ...args: TArgs): unknown {
      const jp: JoinPoint<TTarget, TArgs, unknown> = {
        target: this,
        methodName,
        args,
      };

      try {
        const result = originalMethod.apply(this, args);

        if (isPromiseInstance(result)) {
          return result.catch(async (err: unknown) => {
            const errorObj =
              err instanceof Error ? err : new Error(typeof err === 'string' ? err : '未知执行异常');
            await advice(jp, errorObj);
            throw errorObj;
          });
        }

        return result;
      } catch (err: unknown) {
        const errorObj =
          err instanceof Error ? err : new Error(typeof err === 'string' ? err : '未知执行异常');
        const afterResult = advice(jp, errorObj);

        if (isPromiseInstance<void>(afterResult)) {
          return afterResult.then(() => {
            throw errorObj;
          });
        }

        throw errorObj;
      }
    };

    return descriptor;
  };
}

/**
 * 最终通知装饰器工厂 (@After)
 * 无论目标方法正常结束还是异常退出，均在方法退出时触发（类似 finally）。
 * 对标 Spring Boot 中的 @After("pointcut()")
 *
 * @template TTarget 目标对象的类型
 * @template TArgs   目标方法的入参类型
 * @param advice 最终通知执行函数
 * @returns 标准 TypeScript 方法装饰器
 */
export function After<TTarget extends object, TArgs extends unknown[]>(
  advice: AfterAdvice<TTarget, TArgs>
): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      this: TTarget,
      ...args: TArgs
    ) => unknown;

    const methodName = String(propertyKey);

    descriptor.value = function (this: TTarget, ...args: TArgs): unknown {
      const jp: JoinPoint<TTarget, TArgs, unknown> = {
        target: this,
        methodName,
        args,
      };

      try {
        const result = originalMethod.apply(this, args);

        if (isPromiseInstance(result)) {
          return result.finally(async () => {
            await advice(jp);
          });
        }

        const afterResult = advice(jp);
        if (isPromiseInstance<void>(afterResult)) {
          return afterResult.then(() => result);
        }

        return result;
      } catch (err: unknown) {
        const afterResult = advice(jp);
        if (isPromiseInstance<void>(afterResult)) {
          return afterResult.then(() => {
            throw err;
          });
        }
        throw err;
      }
    };

    return descriptor;
  };
}
