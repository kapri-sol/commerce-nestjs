import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderQueryRepository } from './order.query-repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderQueryRepository: OrderQueryRepository,
  ) {}
}
