import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private readonly orderQueryRepository: OrderQueryRepository,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly orderItemQueryRepository: OrderItemQueryRepository,
    private readonly productQueryRepository: ProductQueryRepository,
    @InjectRepository(Customer)
    private readonly customerQueryRepository: CustomerQueryRepository,
  ) {}

  /**
   * 주문을 생성한다.
   *
   * @param {bigint} customerId
   * @param {CreateOrderDto} createOrderDto
   * @return {*}  {Promise<bigint>}
   * @memberof OrderService
   */
  async createOrder(
    customerId: bigint,
    createOrderDto: CreateOrderDto,
  ): Promise<bigint> {
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

    const orderItems = products.map((product) =>
      OrderItem.of(product, productIdCounttMap.get(product.id)),
    );

    const order = Order.of(customer, orderItems);

    const { id } = await this.orderRepository.save(order);

    return id;
  }

  findOrder(id: bigint): Promise<Order> {
    return this.orderQueryRepository.findOneById(id);
  }

  findOrders(customerId: bigint): Promise<Order[]> {
    return this.orderQueryRepository.findByCustomerId(customerId);
  }

  async cancleOrderItem(orderItemId: bigint): Promise<void> {
    const orderItem = await this.orderItemQueryRepository.findOneById(
      orderItemId,
    );

    if (!orderItem) {
      throw new NotFoundException();
    }

    orderItem.cancle();

    try {
      await this.orderItemRepository.save(orderItem);
    } catch (err) {
      console.error(err);
    }
  }
}
