import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderQueryRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findOneById(id: bigint) {
    // return this.orderRepository.query(
    //   'SELECT * FROM "order" LEFT JOIN "order_item" ON "order_item"."id" = "order"."id" WHERE "order"."id" = 1',
    // );
    // return this.orderRepository.query(
    //   'SELECT "order"."id" AS "order_id", "order"."created_at" AS "order_created_at", "order"."updated_at" AS "order_updated_at", "order"."deleted_at" AS "order_deleted_at", "order"."customer_id" AS "order_customer_id" FROM "order" "order" LEFT JOIN "order_item" "order_item" ON "order_item"."order_id" = "order"."id" WHERE ( "order"."id" = 1 ) AND ( "order"."deleted_at" IS NULL )',
    // );
    return this.orderRepository
      .createQueryBuilder('order')
      .select()
      .leftJoin(OrderItem, 'order_item', 'order_item.order_id = order.id')
      .where('order.id = :id', {
        id: id.toString(),
      })
      .getOne();
  }
}
