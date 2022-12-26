import { BadRequestException } from '@nestjs/common';
import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderItem {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  private _id: bigint;

  @OneToOne(() => Product, (product: Product) => product.orderItems)
  @JoinColumn({
    name: 'product_id',
  })
  private _product: Product;

  @OneToMany(() => Order, (order: Order) => order.orderItems)
  @JoinColumn({
    name: 'order_id',
  })
  private _order: Order;

  @Column({
    name: 'count',
  })
  private _count: number;

  get id() {
    return this._id;
  }

  get product(): Product {
    return this._product;
  }

  get order(): Order {
    return this._order;
  }

  get count(): number {
    return this._count;
  }

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
    orderItem._product = product;
    orderItem._count = count;
    return orderItem;
  }

  /**
   * 상품을 주문한다.
   *
   * @memberof OrderItem
   */
  orderProduct() {
    this._product.order(this._count);
  }
}
