import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerQueryRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  findOneById(id: bigint): Promise<Customer> {
    return this.customerRepository
      .createQueryBuilder()
      .where('id = :id', { id: id.toString() })
      .where('deleted_at is null')
      .getOne();
  }
}
