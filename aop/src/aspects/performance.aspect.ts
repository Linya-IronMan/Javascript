/**
 * @fileoverview 性能监控切面 (Performance Aspect)
 * 对标 Spring Boot 中监控耗时、慢调用（Slow Query / Slow Method）报警的切面。
 * 精确统计方法执行毫秒数，若超过阈值打印黄色警告。
 */

import { Aspect, ProceedingJoinPoint } from '../core/types';
import { isPromiseInstance } from '../core/decorators';

/**
 * 慢方法告警阈值（毫秒）
 */
const SLOW_THRESHOLD_MS = 15;

/**
 * 性能监控环绕通知函数
 *
 * @template T 目标对象类型
 * @param pjp 环绕连接点
 * @returns 目标方法执行结果
 */
export function measurePerformanceAdvice<T extends object>(
  pjp: ProceedingJoinPoint<T, unknown[], unknown>
): unknown {
  const startTime = performance.now();
  const { methodName } = pjp;

  /**
   * 打印耗时分析
   */
  const logTiming = (): void => {
    const elapsed = parseFloat((performance.now() - startTime).toFixed(2));
    if (elapsed > SLOW_THRESHOLD_MS) {
      console.log(
        `\x1b[33m[PERF - 慢调用警告]\x1b[0m 方法 [${methodName}] 耗时 ${elapsed}ms (超过阈值 ${SLOW_THRESHOLD_MS}ms)`
      );
    } else {
      console.log(
        `\x1b[90m[PERF - 性能]\x1b[0m 方法 [${methodName}] 耗时: ${elapsed}ms`
      );
    }
  };

  try {
    const result = pjp.proceed();

    if (isPromiseInstance(result)) {
      return result.finally(() => {
        logTiming();
      });
    }

    logTiming();
    return result;
  } catch (error) {
    logTiming();
    throw error;
  }
}

/**
 * 适用于动态代理工厂的性能切面对象
 */
export const PerformanceAspect: Aspect = {
  name: 'PerformanceAspect',
  around: measurePerformanceAdvice,
};
