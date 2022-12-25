import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@src/entities/order.entity';
import { OrderQueryRepository } from './order.query-repository';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderQueryRepository, OrderService],
  exports: [OrderQueryRepository],
})
export class OrderModule {}
