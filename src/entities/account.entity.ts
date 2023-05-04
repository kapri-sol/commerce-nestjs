import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import { Customer } from './customer.entity';
import { Seller } from './seller.entity';

@Entity()
export class Account {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  id: bigint;

  @OneToOne(() => Customer, (customer: Customer) => customer.account)
  @JoinColumn({
    name: 'customer_id',
  })
  customer: Customer;

  @OneToOne(() => Seller, (seller: Seller) => seller.account)
  @JoinColumn({
    name: 'seller_id',
  })
  seller: Seller;

  @Column({
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({
    name: 'phone',
    unique: true,
  })
  phone: string;

  @Column({
    name: 'password',
  })
  password: string;

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
   * Account 인스턴스를 생성한다.
   *
   * @static
   * @param {string} email
   * @param {string} phone
   * @param {string} password
   * @return {*}  {Account}
   * @memberof Account
   */
  static of(email: string, phone: string, password: string): Account {
    const account = new Account();
    account.email = email;
    account.phone = phone;
    account.password = password;
    return account;
  }

  /**
   * 계정 비밀번호를 해시해서 저장한다.
   *
   * @param {number} [roundOrSecret=10]
   * @memberof Account
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(roundOrSecret = 10) {
    this.password = await bcrypt.hashSync(this.password, roundOrSecret);
  }

  /**
   * 비밀번호가 맞는지 확인한다.
   *
   * @param {string} password
   * @return {*}
   * @memberof Account
   */
  validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  /**
   * 계정 정보를 수정한다.
   *
   * @param {string} [email]
   * @param {string} [password]
   * @memberof Account
   */
  update(phone?: string, password?: string) {
    if (phone) {
      this.phone = phone;
    }

    if (password) {
      this.password = password;
    }
  }
}
