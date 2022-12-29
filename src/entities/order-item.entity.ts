import { BadRequestException } from '@nestjs/common';
import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

export enum OrderItemStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity({
  name: 'order_item',
})
export class OrderItem {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  id: bigint;

  @OneToOne(() => Product, (product: Product) => product.orderItems)
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @ManyToOne(() => Order, (order: Order) => order.orderItems)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @Column({
    name: 'count',
  })
  count: number;

  @Column({
    name: 'status',
    default: OrderItemStatus.PENDING,
  })
  status: OrderItemStatus;

  /**
   * 주문 항목 instance를 생성한다.
   *
   * @static
   * @param {Product} product
   * @param {number} count
   * @return {*}
   * @memberof OrderItem
   */
  static of(product: Product, count: number) {
    if (count <= 0) {
      throw new BadRequestException();
    }

    if (!product.isQuantityOrderable(count)) {
      throw new BadRequestException();
    }

    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.count = count;
    orderItem.status = OrderItemStatus.PENDING;
    return orderItem;
  }

  /**
   * 상품을 주문한다.
   *
   * @memberof OrderItem
   */
  orderProduct() {
    this.product.order(this.count);
  }

  setOrder(order: Order) {
    this.order = order;
  }

  private isCancellable(): boolean {
    return (
      this.status === OrderItemStatus.PENDING ||
      this.status === OrderItemStatus.CONFIRMED
    );
  }

  cancle() {
    if (!this.isCancellable) {
      throw new BadRequestException();
    }
    this.status = OrderItemStatus.CANCELLED;
  }

  changeStatus(status: OrderItemStatus) {
    if (
      status === OrderItemStatus.PENDING ||
      status === OrderItemStatus.CANCELLED
    ) {
      throw new BadRequestException();
    }

    this.status = status;
  }
}
