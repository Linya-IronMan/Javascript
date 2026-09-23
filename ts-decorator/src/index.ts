/**
 * @fileoverview TypeScript 装饰器全景实战主入口
 * 依序执行并演示：
 * 1. 类装饰器 (Class Decorators)
 * 2. 属性与访问器装饰器 (Property & Accessor Decorators)
 * 3. 参数装饰器协同校验 (Parameter Decorators)
 * 4. AOP 方法装饰器核心实战 (Method Decorators with Retry/Log/Timing)
 * 5. 装饰器洋葱执行模型 (Execution Order)
 */

import { DatabaseService, ComponentRegistry } from './01-class-decorator';
import { AppConfig } from './02-property-decorator';
import { UserRegistrationAPI } from './03-parameter-decorator';
import { PaymentService } from './04-aop-method-decorator';
import { ExecutionOrderDemo } from './05-execution-order';

/**
 * 打印色彩分割线与章节标题
 *
 * @param title 章节名称
 */
function printSection(title: string): void {
  console.log('\n' + '='.repeat(72));
  console.log(`\x1b[1m\x1b[36m🚀 ${title}\x1b[0m`);
  console.log('='.repeat(72) + '\n');
}

/**
 * 主执行函数
 */
async function main(): Promise<void> {
  // 1. 类装饰器演示
  printSection('第一部分：类装饰器 (Class Decorator) 实操');
  const dbService = new DatabaseService();
  console.log('调用数据库方法:', dbService.connect());
  const meta = ComponentRegistry.get(DatabaseService);
  console.log('从容器元数据表中读取到的配置:', meta);

  // 2. 属性与访问器装饰器演示
  printSection('第二部分：属性与访问器装饰器 (Property & Accessor Decorator)');
  const config = new AppConfig();
  console.log('未显式设置时的属性默认值回退:');
  console.log(`- timezone: ${config.timezone}`);
  console.log(`- port: ${config.port}`);

  console.log('\n测试访问器 @CacheResult 缓存机制：');
  console.log('第 1 次读取 expensiveTotal 计算值:', config.expensiveTotal);
  console.log('第 2 次读取 expensiveTotal（验证缓存直接命中）:', config.expensiveTotal);

  // 3. 参数装饰器演示
  printSection('第三部分：参数装饰器 (Parameter Decorator) 协同校验');
  const api = new UserRegistrationAPI();

  console.log('👉 [用例 3.1] 传入完整合法参数：');
  const successRes = api.register('林崖', 'linya@example.com', '高级开发工程师');
  console.log(successRes);

  console.log('\n👉 [用例 3.2] 触发必填参数校验拦截（邮箱传入空字符串）：');
  try {
    api.register('张三', '');
  } catch (error) {
    const msg = error instanceof Error ? error.message : '校验异常';
    console.log(`\x1b[31m(捕获到参数校验异常: ${msg})\x1b[0m`);
  }

  // 4. ⭐ AOP 方法装饰器深度实战
  printSection('第四部分：⭐ AOP 方法装饰器实战 (@Log + @MeasureTime + @Retry)');
  const payment = new PaymentService();
  console.log('发起一笔转账交易，模拟前 2 次网络抖动，观察切面自动重试：');
  const txnId = await payment.debit('ACC-998811', 12800);
  console.log(`\x1b[32m交易最终顺利完成，凭证号: ${txnId}\x1b[0m`);

  // 5. 装饰器执行顺序大解密
  printSection('第五部分：装饰器执行时序洋葱模型大解密');
  const orderDemo = new ExecutionOrderDemo();
  console.log('调用被多层嵌套装饰的方法:', orderDemo.testMethod());

  console.log('\n' + '='.repeat(72));
  console.log('\x1b[1m\x1b[32m🎉 TypeScript 装饰器全景演练执行完毕！\x1b[0m');
  console.log('='.repeat(72) + '\n');
}

// 启动入口
main().catch((err) => {
  console.error('执行失败:', err);
});
