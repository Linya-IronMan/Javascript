/**
 * @fileoverview 04. ⭐ AOP 方法装饰器重点精讲 (Method Decorators in AOP)
 * 为什么在整个 AOP 体系中，方法装饰器是当之无愧的绝对主角？
 *
 * 核心真相：
 * 1. 类装饰器拿不到单个方法的执行体；
 * 2. 属性与参数装饰器拿不到方法描述符 (PropertyDescriptor)；
 * 3. 只有【方法装饰器】能够同时拿到：
 *    - target (原型对象)
 *    - propertyKey (方法名)
 *    - descriptor (包含原函数引用的属性描述符)！
 *
 * 借助 descriptor.value 的热替换，我们可以在保持原方法纯净的前提下，将切面逻辑织入其中。
 */

/**
 * 通用方法类型约束
 */
export type AnyMethod<TReturn = unknown> = (...args: unknown[]) => Promise<TReturn> | TReturn;

/**
 * 1. 日志切面方法装饰器工厂 (@Log)
 * 自动拦截出入参，支持自定义模块标签
 *
 * @param tag 业务模块标签
 * @returns 方法装饰器
 */
export function Log(tag = 'DEFAULT'): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as AnyMethod;
    const methodName = String(propertyKey);

    descriptor.value = function (this: object, ...args: unknown[]): unknown {
      console.log(`\x1b[36m[AOP @Log - ${tag}]\x1b[0m 进入方法: ${methodName}(), 入参:`, args);

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result.then((res) => {
            console.log(`\x1b[32m[AOP @Log - ${tag}]\x1b[0m 异步成功: ${methodName}(), 返回:`, res);
            return res;
          });
        }

        console.log(`\x1b[32m[AOP @Log - ${tag}]\x1b[0m 同步成功: ${methodName}(), 返回:`, result);
        return result;
      } catch (err) {
        console.log(`\x1b[31m[AOP @Log - ${tag}]\x1b[0m 执行异常: ${methodName}(), 错误:`, err);
        throw err;
      }
    };

    return descriptor;
  };
}

/**
 * 2. 耗时度量方法装饰器 (@MeasureTime)
 * 精确统计方法执行毫秒耗时
 *
 * @returns 方法装饰器
 */
export function MeasureTime(): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as AnyMethod;
    const methodName = String(propertyKey);

    descriptor.value = function (this: object, ...args: unknown[]): unknown {
      const start = performance.now();

      const logElapsed = (): void => {
        const elapsed = (performance.now() - start).toFixed(2);
        console.log(`\x1b[90m[AOP @MeasureTime]\x1b[0m 方法 [${methodName}] 耗时: ${elapsed}ms\x1b[0m`);
      };

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result.finally(logElapsed);
        }

        logElapsed();
        return result;
      } catch (err) {
        logElapsed();
        throw err;
      }
    };

    return descriptor;
  };
}

/**
 * 3. 自动故障重试方法装饰器工厂 (@Retry)
 * 当方法抛出异常时（如网络抖动、数据库暂时不可用），切面自动捕获并按指定次数与延迟重跑！
 *
 * @param maxAttempts 最大重试次数（默认 3 次）
 * @param delayMs 每次重试间隔毫秒数（默认 50ms）
 * @returns 方法装饰器
 */
export function Retry(maxAttempts = 3, delayMs = 50): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as AnyMethod;
    const methodName = String(propertyKey);

    descriptor.value = async function (this: object, ...args: unknown[]): Promise<unknown> {
      let lastError: unknown;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          if (attempt > 1) {
            console.log(
              `\x1b[33m[AOP @Retry]\x1b[0m 方法 [${methodName}] 正在尝试第 ${attempt}/${maxAttempts} 次重试...\x1b[0m`
            );
          }
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          const msg = error instanceof Error ? error.message : '未知异常';
          console.log(
            `\x1b[31m[AOP @Retry]\x1b[0m 方法 [${methodName}] 第 ${attempt} 次执行失败: "${msg}"`
          );

          if (attempt < maxAttempts && delayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }

      console.log(`\x1b[31m[AOP @Retry 告警]\x1b[0m 方法 [${methodName}] 已达到最大重试上限 ${maxAttempts} 次，宣告失败 ❌`);
      throw lastError;
    };

    return descriptor;
  };
}

/**
 * 业务服务类：演示组合应用多个 AOP 方法装饰器
 */
export class PaymentService {
  private networkFailureCount = 0;

  /**
   * 发起银行扣款
   * 组合装饰器：@Log -> @MeasureTime -> @Retry
   *
   * @param accountId 扣款账户
   * @param amount 扣款金额
   * @returns 扣款交易流水号
   */
  @Log('PAYMENT')
  @MeasureTime()
  @Retry(3, 40)
  public async debit(accountId: string, amount: number): Promise<string> {
    // 模拟前 2 次网络超时失败，第 3 次成功恢复
    if (this.networkFailureCount < 2) {
      this.networkFailureCount++;
      throw new Error(`银行网关网络波动 (Timeout error #${this.networkFailureCount})`);
    }

    // 模拟业务处理
    await new Promise((resolve) => setTimeout(resolve, 30));
    return `TXN_SUCCESS_${accountId}_${amount}_${Date.now()}`;
  }
}
