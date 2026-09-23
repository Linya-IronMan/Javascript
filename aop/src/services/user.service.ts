/**
 * @fileoverview 用户业务服务 (UserService)
 * 演示模式一：基于【注解/装饰器】的 AOP 织入方式。
 * 在类的方法上直接声明切面通知，体验与 Spring Boot 中的 @Transactional、@Log、@PreAuthorize 完全一致。
 */

import { Around, Before } from '../core/decorators';
import { logAroundAdvice } from '../aspects/logging.aspect';
import { measurePerformanceAdvice } from '../aspects/performance.aspect';
import { transactionalAdvice } from '../aspects/transaction.aspect';
import { createAuthorizeAdvice } from '../aspects/auth.aspect';

/**
 * 用户领域实体接口
 */
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

/**
 * 用户服务类
 */
export class UserService {
  private users = new Map<string, UserEntity>();

  /**
   * 查询用户信息
   * 织入日志切面与性能统计切面
   *
   * @param id 用户 ID
   * @returns 匹配的用户对象或 null
   */
  @Around(logAroundAdvice)
  @Around(measurePerformanceAdvice)
  public async getUserById(id: string): Promise<UserEntity | null> {
    // 模拟网络与数据库微小延迟
    await new Promise((resolve) => setTimeout(resolve, 20));
    return this.users.get(id) || null;
  }

  /**
   * 注册创建新用户
   * 织入事务切面与日志切面（模拟若邮箱不合法触发事务回滚）
   *
   * @param id 用户 ID
   * @param name 用户姓名
   * @param email 用户邮箱
   * @returns 新创建的用户实体
   */
  @Around(transactionalAdvice)
  @Around(logAroundAdvice)
  public async createUser(id: string, name: string, email: string): Promise<UserEntity> {
    if (!email.includes('@')) {
      throw new Error(`创建用户失败：邮箱格式非法 [${email}]`);
    }

    const newUser: UserEntity = {
      id,
      name,
      email,
      createdAt: Date.now(),
    };

    this.users.set(id, newUser);
    return newUser;
  }

  /**
   * 删除用户
   * 织入权限切面（仅 ADMIN 允许）与日志切面
   *
   * @param id 用户 ID
   * @returns 是否删除成功
   */
  @Before(createAuthorizeAdvice('ADMIN'))
  @Around(logAroundAdvice)
  public deleteUser(id: string): boolean {
    if (!this.users.has(id)) {
      throw new Error(`用户 ID: ${id} 不存在，无法删除！`);
    }
    return this.users.delete(id);
  }
}
