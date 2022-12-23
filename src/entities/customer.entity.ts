import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Product } from './product.entity';

@Entity()
export class Customer {
  @PrimaryGenerateBigintColumn()
  private _id: bigint;

  @OneToOne(() => Account, (account: Account) => account.customer)
  @JoinColumn()
  private _account: Account;

  @OneToMany(() => Product, (product) => product.owner)
  private _products: Product[];

  @Column()
  private _name: string;

  @Column()
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

  changeName(name: string) {
    this._name = name;
  }

  get address() {
    return this._address;
  }

  changeAddress(address: string) {
    this._address = address;
  }
}
