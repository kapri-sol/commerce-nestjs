import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemQueryRepository {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  findOneById(id: bigint) {
    return this.orderItemRepository
      .createQueryBuilder()
      .where('deleted_at is null')
      .where('id = :id', {
        id: id.toString(),
      })
      .getOne();
  }

  findByIds(ids: bigint[]) {
    return this.orderItemRepository
      .createQueryBuilder()
      .where('deleted_at is null')
      .whereInIds(ids.map((id) => id.toString()))
      .getMany();
  }

  find() {
    return this.orderItemRepository
      .createQueryBuilder('order_item')
      .innerJoin(Order, 'order.id = order_item.id')
      .where('order_item.id = 1')
      .getOne();
  }
}
