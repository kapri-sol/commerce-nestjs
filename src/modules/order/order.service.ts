import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { Repository } from 'typeorm';
import { CustomerQueryRepository } from '../customer/customer.query-repository';
import { ProductQueryRepository } from '../product/product.query-repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemQueryRepository } from './order-item.query-repository';
import { OrderQueryRepository } from './order.query-repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productQueryRepository: ProductQueryRepository,
    @InjectRepository(Customer)
    private readonly customerQueryRepository: CustomerQueryRepository,
  ) {}

  async createOrder(customerId: bigint, createOrderDto: CreateOrderDto) {
    const customer = await this.customerQueryRepository.findOneById(customerId);

    if (!customer) {
      throw new BadRequestException();
    }

    const productIdCounttMap = new Map(
      createOrderDto.orderItems.map(({ productId, count }) => [
        productId,
        count,
      ]),
    );

    const products = await this.productQueryRepository.findByIds(
      createOrderDto.orderItems.map(({ productId }) => productId),
    );

    const createOrderItems = products.map((product) =>
      OrderItem.of(product, productIdCounttMap.get(product.id)),
    );

    console.log('createOrderItems', createOrderItems);

    const orderItems = await this.orderItemRepository.save(createOrderItems);

    console.log('orderItems', orderItems);

    const order = Order.of(customer, orderItems);

    console.log('order', order);

    return this.orderRepository.save(order);
  }
}
