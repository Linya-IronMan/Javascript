/**
 * @fileoverview 事务管理切面 (Transaction Aspect)
 * 对标 Spring Boot 中的 @Transactional 注解与 TransactionAspectSupport。
 * 核心逻辑：
 * 1. 在业务方法执行前，开启新事务并创建数据快照 (Savepoint)；
 * 2. 业务方法正常结束并返回，提交事务 (Commit)；
 * 3. 若业务方法抛出异常，立即触发事务回滚 (Rollback)，还原数据状态，避免脏数据持久化。
 */

import { Aspect, ProceedingJoinPoint } from '../core/types';
import { isPromiseInstance } from '../core/decorators';

/**
 * 模拟事务管理器上下文
 */
export class TransactionContext {
  private static transactionCounter = 1000;
  private static activeTransactions = new Set<string>();

  /**
   * 开启一个新事务并生成唯一事务 ID
   *
   * @returns 生成的事务 ID
   */
  public static begin(): string {
    const txId = `TX-${++this.transactionCounter}`;
    this.activeTransactions.add(txId);
    console.log(`\x1b[35m[TRANSACTION - 开启]\x1b[0m 开启事务 [${txId}]，设置自动提交为 false`);
    return txId;
  }

  /**
   * 提交指定事务
   *
   * @param txId 事务唯一标识
   */
  public static commit(txId: string): void {
    if (this.activeTransactions.has(txId)) {
      this.activeTransactions.delete(txId);
      console.log(`\x1b[35m[TRANSACTION - 提交]\x1b[0m 事务 [${txId}] 提交成功，数据持久化完成 ✅`);
    }
  }

  /**
   * 回滚指定事务
   *
   * @param txId 事务唯一标识
   * @param reason 回滚原因
   */
  public static rollback(txId: string, reason: string): void {
    if (this.activeTransactions.has(txId)) {
      this.activeTransactions.delete(txId);
      console.log(`\x1b[31m[TRANSACTION - 回滚]\x1b[0m 事务 [${txId}] 发生异常: "${reason}"，执行回滚操作 ❌`);
    }
  }
}

/**
 * 事务环绕通知函数
 *
 * @template T 目标对象类型
 * @param pjp 环绕连接点
 * @returns 业务执行结果
 */
export function transactionalAdvice<T extends object>(
  pjp: ProceedingJoinPoint<T, unknown[], unknown>
): unknown {
  const txId = TransactionContext.begin();

  try {
    const result = pjp.proceed();

    if (isPromiseInstance(result)) {
      return result
        .then((resolved) => {
          TransactionContext.commit(txId);
          return resolved;
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : '未知事务异常';
          TransactionContext.rollback(txId, message);
          throw error;
        });
    }

    TransactionContext.commit(txId);
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知事务异常';
    TransactionContext.rollback(txId, message);
    throw error;
  }
}

/**
 * 适用于动态代理工厂的事务切面对象
 */
export const TransactionAspect: Aspect = {
  name: 'TransactionAspect',
  around: transactionalAdvice,
};
