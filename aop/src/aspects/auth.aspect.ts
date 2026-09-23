/**
 * @fileoverview 权限与安全切面 (Security / Auth Aspect)
 * 对标 Spring Boot + Spring Security 中的 @PreAuthorize("hasRole('ADMIN')") 切面。
 * 核心逻辑：
 * 1. 从当前上下文中读取当前用户主体 (Principal)；
 * 2. 检查用户是否具备目标方法所需的角色/权限；
 * 3. 若权限不足，切面直接阻断方法调用，抛出权限异常。
 */

import { JoinPoint } from '../core/types';

/**
 * 用户身份接口
 */
export interface UserPrincipal {
  readonly id: string;
  readonly username: string;
  readonly roles: readonly string[];
}

/**
 * 权限上下文管理器（模拟 Spring SecurityContextHolder）
 */
export class SecurityContextHolder {
  private static currentUser: UserPrincipal | null = null;

  /**
   * 设置当前已认证用户
   *
   * @param user 用户信息或 null
   */
  public static setCurrentUser(user: UserPrincipal | null): void {
    this.currentUser = user;
  }

  /**
   * 获取当前认证用户
   *
   * @returns 当前用户或 null
   */
  public static getCurrentUser(): UserPrincipal | null {
    return this.currentUser;
  }
}

/**
 * 权限不足异常
 */
export class AccessDeniedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessDeniedException';
  }
}

/**
 * 构造按角色校验的前置通知函数
 *
 * @param requiredRoles 允许执行的目标角色列表
 * @returns 前置通知函数
 */
export function createAuthorizeAdvice(
  ...requiredRoles: string[]
): (joinPoint: JoinPoint) => void {
  return function authorizeBeforeAdvice(joinPoint: JoinPoint): void {
    const user = SecurityContextHolder.getCurrentUser();

    console.log(`\x1b[34m[AUTH - 鉴权检查]\x1b[0m 正在校验执行方法 [${joinPoint.methodName}] 所需角色: [${requiredRoles.join(', ')}]`);

    if (!user) {
      throw new AccessDeniedException(`未认证用户无法执行 [${joinPoint.methodName}]，请先登录！`);
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new AccessDeniedException(
        `用户 [${user.username}] 权限不足！当前角色: [${user.roles.join(', ')}]，需要: [${requiredRoles.join(', ')}]`
      );
    }

    console.log(`\x1b[32m[AUTH - 鉴权通过]\x1b[0m 用户 [${user.username}] 身份验证成功，放行调用 ✅`);
  };
}
