import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PrimaryGenerateBigintColumn } from 'src/decorator/primary-generate-bigint-column.decorator';

@Entity()
export class Account {
  @PrimaryGenerateBigintColumn({
    name: 'account_id',
    primaryKeyConstraintName: 'PK_ACCOUND_ID',
  })
  accountId: bigint;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
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
    name: 'delete_at',
  })
  deletedAt: Date;

  private constructor() {}

  /**
   * Account 인스턴스를 생성한다.
   *
   * @static
   * @param {string} email
   * @param {string} password
   * @return {*}  {Account}
   * @memberof Account
   */
  static of(email: string, password: string): Account {
    const account = new Account();
    account.email = email;
    account.password = password;
    return account;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
