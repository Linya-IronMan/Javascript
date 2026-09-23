/**
 * @fileoverview 02. 属性装饰器与访问器装饰器 (Property & Accessor Decorators)
 * 1. 属性装饰器 (Property Decorator)：作用于类的属性字段，可用于声明校验规则或默认值；
 * 2. 访问器装饰器 (Accessor Decorator)：作用于 getter / setter，可劫持属性读取，实现缓存与懒加载。
 */

/**
 * 属性默认值装饰器工厂 (@DefaultValue)
 * 当读取该属性且值为 undefined 时，自动回退到设定的默认值
 *
 * @template T 默认值类型
 * @param defaultValue 预设的默认值
 * @returns 属性装饰器函数
 */
export function DefaultValue<T>(defaultValue: T): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const privateKey = Symbol(String(propertyKey));

    console.log(
      `\x1b[35m[属性装饰器 @DefaultValue]\x1b[0m 为字段 [${String(propertyKey)}] 配置默认回退值:`,
      defaultValue
    );

    Object.defineProperty(target, propertyKey, {
      get(): T {
        const storedValue = (this as Record<symbol, unknown>)[privateKey];
        return storedValue !== undefined ? (storedValue as T) : defaultValue;
      },
      set(newVal: T): void {
        (this as Record<symbol, unknown>)[privateKey] =
          newVal !== undefined ? newVal : defaultValue;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

/**
 * 访问器计算结果缓存装饰器 (@CacheResult)
 * 针对高耗时的 getter 访问器，仅在首次访问时执行计算，后续直接命中缓存
 *
 * @returns 访问器方法装饰器
 */
export function CacheResult(): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalGetter = descriptor.get;
    if (!originalGetter) {
      throw new Error(`@CacheResult 只能应用于 getter 访问器，[${String(propertyKey)}] 不是 getter！`);
    }

    const cacheKey = Symbol(`cache_${String(propertyKey)}`);

    console.log(`\x1b[35m[访问器装饰器 @CacheResult]\x1b[0m 劫持 getter [${String(propertyKey)}] 开启结果缓存`);

    descriptor.get = function (this: object): unknown {
      const instanceMap = this as Record<symbol, unknown>;
      if (instanceMap[cacheKey] !== undefined) {
        console.log(`\x1b[90m(命中 getter [${String(propertyKey)}] 缓存，直接返回)\x1b[0m`);
        return instanceMap[cacheKey];
      }

      console.log(`\x1b[33m(首次访问 getter [${String(propertyKey)}]，开始昂贵计算...)\x1b[0m`);
      const result = originalGetter.apply(this);
      instanceMap[cacheKey] = result;
      return result;
    };

    return descriptor;
  };
}

/**
 * 演示类：系统配置与昂贵统计报表
 */
export class AppConfig {
  @DefaultValue('Asia/Shanghai')
  public timezone?: string;

  @DefaultValue(8080)
  public port?: number;

  private numbers: number[] = [10, 20, 30, 40, 50];

  /**
   * 模拟高耗时计算属性
   */
  @CacheResult()
  public get expensiveTotal(): number {
    // 模拟重度求和计算
    return this.numbers.reduce((acc, cur) => acc + cur, 0);
  }
}
