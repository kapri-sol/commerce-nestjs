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
  private _id: bigint;

  @OneToOne(() => Account, (account: Account) => account.customer)
  private _account: Account;

  @OneToMany(() => Product, (product) => product.seller)
  private _products: Product[];

  @OneToOne(() => Order, (order: Order) => order.customer)
  private _orders: Order[];

  @Column({
    name: 'name',
  })
  private _name: string;

  @Column({
    name: 'address',
  })
  private _address: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  private _created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  private _updated_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  private _deleted_at: Date;

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
    customer._name = name;
    customer._address = address;
    customer._account = account;
    return customer;
  }

  get id() {
    return this._id;
  }

  get account() {
    return this._account;
  }

  set account(account: Account) {
    this._account = account;
  }

  get products(): Product[] {
    return this._products;
  }

  get name() {
    return this._name;
  }

  get address() {
    return this._address;
  }

  get orders(): Order[] {
    return this._orders;
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
      this._name = name;
    }

    if (address) {
      this._address = address;
    }
  }
}
