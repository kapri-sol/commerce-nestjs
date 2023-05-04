import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class Customer {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  id: bigint;

  @OneToOne(() => Account, (account: Account) => account.customer)
  account: Account;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Order, (order: Order) => order.customer)
  orders: Order[];

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'address',
  })
  address: string;

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

  /**
   * Customer 인스턴스를 생성한다.
   *
   * @static
   * @param {string} name 이름
   * @param {string} address 주소
   * @param {Account} account 계정
   * @return {*}
   * @memberof Customer
   */
  static of(name: string, address: string, account: Account) {
    const customer = new Customer();
    customer.name = name;
    customer.address = address;
    customer.account = account;
    return customer;
  }

  /**
   * 고객 정보를 수정한다.
   *
   * @param {string} [name]
   * @param {string} [address]
   * @memberof Customer
   */
  update(name?: string, address?: string) {
    if (name) {
      this.name = name;
    }

    if (address) {
      this.address = address;
    }
  }
}
