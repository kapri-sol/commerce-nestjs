import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { AccountModule } from '../account/account.module';
import { CustomerController } from './customer.controller';
import { CustomerQueryRepository } from './customer.query-repository';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AccountModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerQueryRepository],
})
export class CustomerModule {}
