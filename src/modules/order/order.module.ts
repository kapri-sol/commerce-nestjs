import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { OrderItemQueryRepository } from './order-item.query-repository';
import { OrderController } from './order.controller';
import { OrderQueryRepository } from './order.query-repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductModule,
    CustomerModule,
  ],
  controllers: [OrderController],
  providers: [OrderItemQueryRepository, OrderQueryRepository, OrderService],
  exports: [OrderItemQueryRepository, OrderQueryRepository],
})
export class OrderModule {}
