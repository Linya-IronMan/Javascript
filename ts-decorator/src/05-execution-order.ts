/**
 * @fileoverview 05. 装饰器执行顺序大解密 (Execution Order & Onion Model)
 *
 * 核心考点与原理：
 * 1. 装饰器工厂求值顺序 (Evaluation Order)：从上到下 (Top-Down)；
 * 2. 装饰器函数实际执行顺序 (Execution Order)：从下到上 (Bottom-Up，类似洋葱模型或函数组合 f(g(x)))；
 * 3. 类成员与类的先后顺序：
 *    - 成员级别：参数装饰器 -> 方法/属性/访问器装饰器；
 *    - 类级别：类装饰器永远在所有成员装配完毕后，最后压轴执行！
 */

/**
 * 带有日志的测试装饰器工厂
 *
 * @param name 装饰器标识名称
 * @returns 装饰器函数
 */
export function OrderTrace(name: string): MethodDecorator {
  console.log(`\x1b[33m[1. 求值 (Evaluation)]\x1b[0m 正在求值装饰器工厂: OrderTrace("${name}") (从上到下)`);

  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    console.log(`\x1b[32m[2. 执行 (Execution)]\x1b[0m 正在应用装饰器函数: @OrderTrace("${name}") (从下到上，如同洋葱包裹)`);
    return descriptor;
  };
}

/**
 * 演示类：多层方法装饰器嵌套
 */
export class ExecutionOrderDemo {
  /**
   * 堆叠三个方法装饰器：
   * 观察工厂求值 vs 实际执行的先后次序
   */
  @OrderTrace('外层 (Outer)')
  @OrderTrace('中层 (Middle)')
  @OrderTrace('内层 (Inner)')
  public testMethod(): string {
    return '执行结果';
  }
}
