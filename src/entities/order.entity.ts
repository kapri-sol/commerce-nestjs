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

@Entity()
export class Order {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  private _id: bigint;

  @ManyToOne(() => Customer, (customer: Customer) => customer)
  @JoinColumn({
    name: 'customer_id',
  })
  private _customer: Customer;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  private _orderItems: OrderItem[];

  @CreateDateColumn({
    name: 'created_at',
  })
  private _createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  private _updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  private _deletedAt: Date;

  /**
   * 주문 인스턴스를 생성한다.
   *
   * @static
   * @param {Customer} customer
   * @param {OrderItem[]} orderItems
   * @return {*}
   * @memberof Order
   */
  static of(customer: Customer, orderItems: OrderItem[]) {
    const order = new Order();
    order._customer = customer;
    order._orderItems = orderItems;
    return order;
  }

  get id(): bigint {
    return this._id;
  }

  get orderItems(): OrderItem[] {
    return this._orderItems;
  }

  get customer(): Customer {
    return this._customer;
  }
}
