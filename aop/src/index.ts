/**
 * @fileoverview AOP 演示项目主入口
 * 全方位对比演示 Spring Boot AOP 在 TypeScript 下的两种具体实现形态：
 * 1. 装饰器织入模式（声明式，对齐 @Transactional / @Aspect 注解）
 * 2. 动态代理织入模式（编程式/容器式，对齐 Spring 底层 ProxyFactory 动态代理）
 */

import { UserService } from './services/user.service';
import { OrderService } from './services/order.service';
import { SecurityContextHolder } from './aspects/auth.aspect';
import { AopProxyFactory } from './core/proxy-factory';
import { LoggingAspect } from './aspects/logging.aspect';
import { PerformanceAspect } from './aspects/performance.aspect';
import { TransactionAspect } from './aspects/transaction.aspect';

/**
 * 打印色彩分割线与标题
 *
 * @param title 场景标题
 */
function printSection(title: string): void {
  console.log('\n' + '='.repeat(70));
  console.log(`\x1b[1m\x1b[33m🌟 ${title}\x1b[0m`);
  console.log('='.repeat(70) + '\n');
}

/**
 * 主执行函数
 */
async function main(): Promise<void> {
  printSection('场景一：基于【装饰器】的 AOP 织入演示（体验对齐 Spring Boot 注解）');

  const userService = new UserService();

  // 1. 正常执行：触发 日志 + 性能统计 切面
  console.log('👉 [用例 1.1] 查询用户（体验 @Around(log) + @Around(perf)）：');
  await userService.getUserById('U-1001');

  // 2. 事务成功：触发 @Around(transactional) + @Around(log)
  console.log('\n👉 [用例 1.2] 成功创建用户（体验事务正常 Commit）：');
  await userService.createUser('U-1002', '张三', 'zhangsan@example.com');

  // 3. 事务回滚：邮箱格式错误抛出异常，触发自动 Rollback
  console.log('\n👉 [用例 1.3] 创建用户异常（体验事务捕获并自动 Rollback）：');
  try {
    await userService.createUser('U-1003', '李四', 'invalid-email-format');
  } catch (error) {
    const msg = error instanceof Error ? error.message : '业务错误';
    console.log(`\x1b[90m(主程序捕获到业务异常: ${msg})\x1b[0m`);
  }

  // 4. 权限拦截：未认证或普通角色调用被阻止
  console.log('\n👉 [用例 1.4] 普通用户越权删除（体验 @Before(auth) 权限拦截）：');
  SecurityContextHolder.setCurrentUser({
    id: 'U-999',
    username: '普通游客',
    roles: ['GUEST'],
  });

  try {
    userService.deleteUser('U-1002');
  } catch (error) {
    const msg = error instanceof Error ? error.message : '权限错误';
    console.log(`\x1b[90m(主程序捕获到安全拦截: ${msg})\x1b[0m`);
  }

  // 5. 权限通过：管理员角色放行
  console.log('\n👉 [用例 1.5] 切换为管理员角色执行删除：');
  SecurityContextHolder.setCurrentUser({
    id: 'ADMIN-01',
    username: '超级管理员',
    roles: ['ADMIN'],
  });
  userService.deleteUser('U-1002');
  console.log('用户 U-1002 成功删除！');

  printSection('场景二：基于【动态代理工厂】的纯净 AOP 织入（对齐 Spring CGLIB/JDK 代理）');

  // 纯净业务实例，不包含任何装饰器代码
  const rawOrderService = new OrderService();

  // 通过 AopProxyFactory 织入日志、性能与事务切面
  const proxiedOrderService = AopProxyFactory.create(rawOrderService, [
    LoggingAspect,
    PerformanceAspect,
    TransactionAspect,
  ]);

  console.log('👉 [用例 2.1] 纯净业务对象经代理工厂执行下单操作：');
  await proxiedOrderService.createOrder('ORD-8801', 'U-1001', [
    { productId: 'P-MACBOOK', quantity: 1, unitPrice: 15999 },
    { productId: 'P-MOUSE', quantity: 2, unitPrice: 399 },
  ]);

  console.log('\n👉 [用例 2.2] 支付订单（由于支付金额不足引发回滚）：');
  try {
    await proxiedOrderService.payOrder('ORD-8801', 5000);
  } catch (error) {
    const msg = error instanceof Error ? error.message : '支付异常';
    console.log(`\x1b[90m(主程序捕获到业务异常: ${msg})\x1b[0m`);
  }

  printSection('🎉 所有 AOP 场景演示完毕！');
}

// 启动入口
main().catch((error) => {
  console.error('执行出错:', error);
});
