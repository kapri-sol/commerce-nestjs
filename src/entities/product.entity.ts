import { BadRequestException } from '@nestjs/common';
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
import { OrderItem } from './order-item.entity';
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

  @OneToOne(() => OrderItem, (orderItem: OrderItem) => orderItem.product)
  @JoinColumn({
    name: 'order_item_id',
  })
  private _orderItems: OrderItem[];

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
    name: 'quantity',
  })
  private _quantity: number;

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

  get id(): bigint {
    return this._id;
  }

  get orderItems(): OrderItem[] {
    return this._orderItems;
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

  get quantity(): number {
    return this._quantity;
  }

  /**
   * Product 인스턴스를 생성한다.
   *
   * @static
   * @param {string} name 이름
   * @param {string} description 설명
   * @param {number} price 가격
   * @param {number} quantity 수량
   * @param {Seller} seller 판매자
   * @return {*}  {Product}
   * @memberof Product
   */
  static of(
    name: string,
    description: string,
    price: number,
    quantity: number,
    seller: Seller,
  ): Product {
    if (quantity <= 0) {
      throw new BadRequestException();
    }

    const product = new Product();
    product._name = name;
    product._description = description;
    product._price = price;
    product._quantity = quantity;
    product._seller = seller;
    return product;
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

  /**
   * 상품을 수량만큼 주문한다.
   *
   * @param {number} count 주문 개수
   * @memberof Product
   */
  order(count: number) {
    this._quantity -= count;

    if (this._quantity < 0) {
      throw new BadRequestException();
    }
  }

  /**
   * 상품 수량이 주문할 만큼 있는지 확인한다.
   *
   * @param {*} count
   * @return {*}  {boolean}
   * @memberof Product
   */
  isQuantityOrderable(count): boolean {
    return this._quantity > count;
  }
}
