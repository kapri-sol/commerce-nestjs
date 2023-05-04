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
  id: bigint;

  @OneToOne(() => Account, (account: Account) => account.seller)
  account: Account;

  @OneToMany(() => Product, (product: Product) => product.seller)
  products: Product[];

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
    seller.name = name;
    seller.address = address;
    seller.account = account;
    return seller;
  }

  /**
   * 판매자 정보를 수정한다.
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
