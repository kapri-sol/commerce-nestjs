import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@src/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderQueryRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  findOneById(id: bigint): Promise<Order> {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'order_item')
      .leftJoinAndSelect('order_item.product', 'product')
      .where('order.id = :id', {
        id: id.toString(),
      })
      .getOne();
  }

  findByCustomerId(customerId: bigint): Promise<Order[]> {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'order_item')
      .leftJoinAndSelect('order_item.product', 'product')
      .where('customer_id = :id', {
        id: customerId.toString(),
      })
      .getMany();
  }
}
