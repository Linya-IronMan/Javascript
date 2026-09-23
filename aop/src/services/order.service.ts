/**
 * @fileoverview 订单业务服务 (OrderService)
 * 演示模式二：基于【动态代理工厂】的纯净非侵入式 AOP。
 * 业务类自身没有任何装饰器，保持完全纯净。
 * 切面是在运行时通过 AopProxyFactory.create() 外部动态织入的（模拟 Spring IoC 容器生成 Proxy Bean）。
 */

/**
 * 订单商品条目
 */
export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * 订单实体接口
 */
export interface OrderEntity {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}

/**
 * 纯净的订单服务实现类
 */
export class OrderService {
  private orders = new Map<string, OrderEntity>();

  /**
   * 下单创建方法
   *
   * @param orderId 订单编号
   * @param userId 下单用户 ID
   * @param items 订单商品项
   * @returns 生成的订单实体
   */
  public async createOrder(
    orderId: string,
    userId: string,
    items: OrderItem[]
  ): Promise<OrderEntity> {
    if (items.length === 0) {
      throw new Error('下单失败：商品列表不能为空！');
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    // 模拟下单耗时
    await new Promise((resolve) => setTimeout(resolve, 30));

    const order: OrderEntity = {
      orderId,
      userId,
      items,
      totalAmount,
      status: 'PENDING',
    };

    this.orders.set(orderId, order);
    return order;
  }

  /**
   * 支付订单方法
   *
   * @param orderId 订单编号
   * @param paymentAmount 支付金额
   * @returns 支付后的订单实体
   */
  public async payOrder(orderId: string, paymentAmount: number): Promise<OrderEntity> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`支付失败：订单 [${orderId}] 不存在！`);
    }

    if (paymentAmount < order.totalAmount) {
      throw new Error(
        `支付金额不足！应付: ￥${order.totalAmount}，实付: ￥${paymentAmount}`
      );
    }

    order.status = 'PAID';
    return order;
  }

  /**
   * 查询指定订单
   *
   * @param orderId 订单编号
   * @returns 订单或 null
   */
  public getOrder(orderId: string): OrderEntity | null {
    return this.orders.get(orderId) || null;
  }
}
