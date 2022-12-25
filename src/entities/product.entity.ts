import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Seller } from './seller.entity';

@Entity()
export class Product {
  @PrimaryGenerateBigintColumn({
    name: 'id',
  })
  private _id: bigint;

  @ManyToOne(() => Seller, (seller: Seller) => seller.products)
  @JoinColumn({
    name: 'seller_id',
  })
  private _seller: Seller;

  @OneToOne(() => Order, (order) => order)
  @JoinColumn({
    name: 'order_id',
  })
  private _order: Order;

  @Column({
    name: 'name',
  })
  private _name: string;

  @Column({
    type: 'text',
    name: 'description',
  })
  private _description: string;

  @Column({
    name: 'price',
  })
  private _price: number;

  @Column({
    name: 'image',
    default: null,
  })
  private _image: string;

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
   * Product 인스턴스를 생성한다.
   *
   * @static
   * @param {string} name 이름
   * @param {string} description 설명
   * @param {number} price 가격
   * @param {Customer} seller 판매자
   * @return {*}
   * @memberof Product
   */
  static of(name: string, description: string, price: number, seller: Seller) {
    const product = new Product();
    product._name = name;
    product._description = description;
    product._price = price;
    product._seller = seller;
    return product;
  }

  get id(): bigint {
    return this._id;
  }

  get order(): Order {
    return this._order;
  }

  get seller(): Seller {
    return this._seller;
  }

  get name(): string {
    return this._name;
  }

  get image(): string {
    return this._image;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  /**
   * 상품의 정보를 수정한다.
   *
   * @param {string} [name] 이름
   * @param {string} [description] 설명
   * @param {number} [price] 가격
   * @param {string} [image] 이미지
   * @memberof Product
   */
  update(name?: string, description?: string, price?: number, image?: string) {
    if (name) {
      this._name = name;
    }

    if (description) {
      this._description = description;
    }

    if (price) {
      this._price = price;
    }

    if (image) {
      this._image = image;
    }
  }
}
