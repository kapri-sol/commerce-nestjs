import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { OrderItemQueryRepository } from './order-item.query-repository';
import { OrderQueryRepository } from './order.query-repository';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order])],
  providers: [OrderItemQueryRepository, OrderQueryRepository, OrderService],
  exports: [OrderItemQueryRepository, OrderQueryRepository],
})
export class OrderModule {}
