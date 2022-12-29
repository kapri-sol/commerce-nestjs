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

  orderProduct() {
    this.product.order(this.count);
  }

  setOrder(order: Order) {
    this.order = order;
  }

  private get isCancellable(): boolean {
    return (
      this.status === OrderItemStatus.PENDING ||
      this.status === OrderItemStatus.CONFIRMED
    );
  }

  private get isConfirmable(): boolean {
    return this.status === OrderItemStatus.PENDING;
  }

  private get isShipable(): boolean {
    return this.status === OrderItemStatus.CONFIRMED;
  }

  private get isDeliverable(): boolean {
    return this.status === OrderItemStatus.SHIPPED;
  }

  confirm() {
    if (!this.isConfirmable) {
      throw new BadRequestException();
    }
    this.status = OrderItemStatus.CONFIRMED;
  }

  ship() {
    if (!this.isShipable) {
      throw new BadRequestException();
    }
    this.status = OrderItemStatus.SHIPPED;
  }

  delivery() {
    if (!this.isDeliverable) {
      throw new BadRequestException();
    }
    this.status = OrderItemStatus.DELIVERED;
  }

  cancel() {
    if (!this.isCancellable) {
      throw new BadRequestException();
    }
    this.status = OrderItemStatus.CANCELLED;
  }
}
