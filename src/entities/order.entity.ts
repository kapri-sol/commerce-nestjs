import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  id: bigint;

  @ManyToOne(() => Customer, (customer: Customer) => customer)
  @JoinColumn({
    name: 'customer_id',
  })
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItem[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;

  // get id(): bigint {
  //   return this._id;
  // }

  // get orderItems(): OrderItem[] {
  //   return this._orderItems;
  // }

  // set orderItems(orderItesms: OrderItem[]) {
  //   this._orderItems = orderItesms;
  // }

  // get customer(): Customer {
  //   return this._customer;
  // }

  /**
   * 주문 인스턴스를 생성한다.
   *
   * @static
   * @param {Customer} customer
   * @param {OrderItem[]} orderItems
   * @return {*}  {Order}
   * @memberof Order
   */
  static of(customer: Customer, orderItems: OrderItem[]): Order {
    const order = new Order();
    order.customer = customer;
    orderItems.forEach((orderItem) => orderItem.setOrder(order));
    order.orderItems = orderItems;
    return order;
  }

  orderProducts() {
    this.orderItems.forEach((orderItem) => orderItem.orderProduct());
  }
}
