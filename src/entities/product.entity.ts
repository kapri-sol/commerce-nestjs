import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Product {
  @PrimaryGenerateBigintColumn()
  private _id: bigint;

  @ManyToOne(() => Customer, (customer) => customer.products)
  @JoinColumn()
  private _owner: Customer;

  @Column()
  private _name: string;

  @CreateDateColumn()
  private createdAt: Date;

  @UpdateDateColumn()
  private _updatedAt: Date;

  @DeleteDateColumn()
  private _deletedAt: Date;

  get id(): bigint {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get owner(): Customer {
    return this._owner;
  }
}
