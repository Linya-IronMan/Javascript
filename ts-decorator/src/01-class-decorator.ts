/**
 * @fileoverview 01. 类装饰器 (Class Decorators)
 * 类装饰器作用于类的构造函数本身。
 * 它可以用来：
 * 1. 监控、修改或替换类定义；
 * 2. 冻结原型 (Object.freeze / Object.seal)，防止运行时被动态恶意篡改；
 * 3. 注入类级别的元数据（类似 Spring 中的 @Component / @Service）。
 */

/**
 * 构造函数类型定义
 */
export type Constructor<T = object> = new (...args: unknown[]) => T;

/**
 * 类封印装饰器 (@Sealed)
 * 密封类的构造函数及其原型，禁止向其动态新增或删除属性
 *
 * @template T 构造函数类型
 * @param constructor 目标类的构造函数
 */
export function Sealed<T extends Constructor>(constructor: T): void {
	console.log(
		`\x1b[36m[类装饰器 @Sealed]\x1b[0m 正在密封类 [${constructor.name}] 的原型与构造器...`,
	);
	// TODO: 补充 Object.seal 的作用
	Object.seal(constructor);
	Object.seal(constructor.prototype);
}

/**
 * 组件元数据接口
 */
export interface ComponentMetadata {
	readonly id: string;
	readonly scope: "SINGLETON" | "PROTOTYPE";
	readonly description: string;
}

/**
 * 组件元数据注册表（模拟 Spring IoC 容器元数据存储）
 */
export const ComponentRegistry = new Map<Constructor, ComponentMetadata>();

/**
 * 组件类装饰器工厂 (@Component)
 * 类似 Spring Boot 中的 @Component / @Service 注解，为类附加元数据
 *
 * @param metadata 组件配置元数据
 * @returns 类装饰器函数
 */
export function Component(metadata: ComponentMetadata): ClassDecorator {
	return function (target: Function): void {
		const ctor = target as unknown as Constructor;
		ComponentRegistry.set(ctor, metadata);
		console.log(
			`\x1b[36m[类装饰器 @Component]\x1b[0m 成功注册组件: [${target.name}], ID: "${metadata.id}", Scope: ${metadata.scope}`,
		);
	};
}

/**
 * 演示被类装饰器修饰的数据库服务类
 */
@Component({
	id: "databaseService",
	scope: "SINGLETON",
	description: "全局单例数据库连接服务",
})
@Sealed
export class DatabaseService {
	public connect(): string {
		return "数据库连接成功 (MySQL on port 3306)";
	}
}
