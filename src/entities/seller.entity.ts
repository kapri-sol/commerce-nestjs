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
import { Product } from './product.entity';

@Entity()
export class Seller {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  private _id: bigint;

  @OneToOne(() => Account, (account: Account) => account.seller)
  private _account: Account;

  @OneToMany(() => Product, (product: Product) => product.seller)
  private _products: Product[];

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
   * Seller 인스턴스를 생성한다.
   *
   * @static
   * @param {string} name 이름
   * @param {string} address 주소
   * @param {Account} account 계정
   * @return {*}  {Seller}
   * @memberof Seller
   */
  static of(name: string, address: string, account: Account): Seller {
    const seller = new Seller();
    seller._name = name;
    seller._address = address;
    seller._account = account;
    return seller;
  }

  get id(): bigint {
    return this._id;
  }

  get products(): Product[] {
    return this._products;
  }

  get name(): string {
    return this._name;
  }

  get address(): string {
    return this._address;
  }

  get account(): Account {
    return this._account;
  }
}
