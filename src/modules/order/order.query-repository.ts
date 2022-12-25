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

  findOneById(id: bigint) {
    return this.orderRepository
      .createQueryBuilder()
      .where('deleted_at is null')
      .where('id = :id', {
        id: id.toString(),
      })
      .getOne();
  }
}
