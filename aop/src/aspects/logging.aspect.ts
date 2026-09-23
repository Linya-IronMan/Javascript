/**
 * @fileoverview 日志切面 (Logging Aspect)
 * 对标 Spring Boot 中的 @Aspect 类中的日志切面。
 * 负责在方法执行前后自动记录调用方法名、传入参数、返回结果及异常信息。
 */

import { Aspect, ProceedingJoinPoint } from '../core/types';
import { isPromiseInstance } from '../core/decorators';

/**
 * 格式化参数对象，提供易于阅读的控制台输出
 *
 * @param args 参数列表
 * @returns 格式化后的 JSON 字符串
 */
function formatArguments(args: unknown[]): string {
  try {
    return JSON.stringify(args);
  } catch {
    return '[Complex Arguments]';
  }
}

/**
 * 结构化日志通知函数（环绕通知）
 *
 * @template T 目标对象类型
 * @param pjp 环绕连接点
 * @returns 目标方法执行结果
 */
export function logAroundAdvice<T extends object>(
  pjp: ProceedingJoinPoint<T, unknown[], unknown>
): unknown {
  const { methodName, args } = pjp;
  const targetName = pjp.target.constructor.name;

  console.log(`\x1b[36m[LOG - 前置]\x1b[0m 准备调用: ${targetName}.${methodName}(), 入参: ${formatArguments(args)}`);

  const result = pjp.proceed();

  if (isPromiseInstance(result)) {
    return result
      .then((resolved) => {
        console.log(`\x1b[32m[LOG - 返回]\x1b[0m 成功执行: ${targetName}.${methodName}(), 返回值:`, resolved);
        return resolved;
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : '未知异常';
        console.log(`\x1b[31m[LOG - 异常]\x1b[0m 执行失败: ${targetName}.${methodName}(), 异常: ${message}`);
        throw error;
      });
  }

  console.log(`\x1b[32m[LOG - 返回]\x1b[0m 成功执行: ${targetName}.${methodName}(), 返回值:`, result);
  return result;
}

/**
 * 适用于动态代理工厂的日志切面对象
 */
export const LoggingAspect: Aspect = {
  name: 'LoggingAspect',
  around: logAroundAdvice,
};
