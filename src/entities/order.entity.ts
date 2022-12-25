import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Order {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  private _id: bigint;

  @OneToOne(() => Product, (product) => product.order)
  @JoinColumn({
    name: 'product_id',
  })
  private _product: Product;

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

  static of() {}

  get id(): bigint {
    return this._id;
  }

  get product(): Product {
    return this._product;
  }
}
