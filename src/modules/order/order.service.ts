import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { Order } from '@src/entities/order.entity';
import { Repository } from 'typeorm';
import { CustomerQueryRepository } from '../customer/customer.query-repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemQueryRepository } from './order-item.query-repository';
import { OrderQueryRepository } from './order.query-repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly orderItemQueryRepository: OrderItemQueryRepository,
    @InjectRepository(Customer)
    private readonly customerQueryRepository: CustomerQueryRepository,
  ) {}

  async createOrder(customerId: bigint, createOrderDto: CreateOrderDto) {
    const customer = await this.customerQueryRepository.findOneById(customerId);

    if (!customer) {
      throw new BadRequestException();
    }

    const orderItems = await this.orderItemQueryRepository.findByIds(
      createOrderDto.orderItemIds,
    );

    if (orderItems.length !== createOrderDto.orderItemIds.length) {
      throw new BadRequestException();
    }

    const order = Order.of(customer, orderItems);

    return this.orderRepository.save(order);
  }
}
