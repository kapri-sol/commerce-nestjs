import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entity/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  save(customer: Customer): Promise<Customer> {
    return this.customerRepository.save(customer);
  }

  findOneById(id: bigint): Promise<Customer> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.customer_id = :id', { id: id.toString() })
      .where('customer.deleted_at is null')
      .getOne();
  }

  clear() {
    return this.customerRepository.clear();
  }
}
