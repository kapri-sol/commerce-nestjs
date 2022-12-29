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
  id: bigint;

  @ManyToOne(() => Seller, (seller: Seller) => seller.products)
  @JoinColumn({
    name: 'seller_id',
  })
  seller: Seller;

  @OneToOne(() => OrderItem, (orderItem: OrderItem) => orderItem.product)
  @JoinColumn({
    name: 'order_item_id',
  })
  orderItems: OrderItem[];

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    type: 'text',
    name: 'description',
  })
  description: string;

  @Column({
    name: 'price',
  })
  price: number;

  @Column({
    name: 'quantity',
  })
  quantity: number;

  @Column({
    name: 'image',
    default: null,
  })
  image: string;

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
    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.seller = seller;
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
      this.name = name;
    }

    if (description) {
      this.description = description;
    }

    if (price) {
      this.price = price;
    }

    if (image) {
      this.image = image;
    }
  }

  /**
   * 상품을 수량만큼 주문한다.
   *
   * @param {number} count 주문 개수
   * @memberof Product
   */
  order(count: number) {
    this.quantity -= count;

    if (this.quantity < 0) {
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
    return this.quantity > count;
  }
}
