import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Account } from '@src/entities/account.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * 고객을 생성한다.
   *
   * @param {CreateCustomerDto} createCustomerDto
   * @return {*}  {Promise<bigint>}
   * @memberof CustomerService
   */
  async createCustomer(
    accountId: bigint,
    createCustomerDto: CreateCustomerDto,
  ): Promise<bigint> {
    const { name, address } = createCustomerDto;

    const account = await this.accountRepository.findOneBy({
      id: accountId,
    });

    if (!account) {
      throw new NotFoundException();
    }

    const customer = Customer.of(name, address, account);

    const { id } = await this.customerRepository.save(customer);

    return id;
  }

  /**
   * 고객을 id로 검색한다.
   *
   * @param {bigint} customerId
   * @return {*}  {Promise<Customer>}
   * @memberof CustomerService
   */
  async findCustomerById(customerId: bigint): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({
      id: customerId,
    });

    if (!customer) {
      throw new NotFoundException();
    }

    return customer;
  }

  /**
   * 고객 정보를 변경한다.
   *
   * @param {bigint} customerId
   * @param {UpdateCustomerDto} updateCustomerDto
   * @return {*}  {Promise<void>}
   * @memberof CustomerService
   */
  async updateCustomer(
    customerId: bigint,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<void> {
    const customer = await this.customerRepository.findOneBy({
      id: customerId,
    });

    if (!customer) {
      throw new NotFoundException();
    }

    const { name, address } = updateCustomerDto;

    customer.update(name, address);

    await this.customerRepository.save(customer);
  }

  /**
   * 고객정보를 제거한다.
   *
   * @param {bigint} customerId
   * @memberof CustomerService
   */
  async removeCustomer(customerId: bigint) {
    const customer = await this.customerRepository.findOneBy({
      id: customerId,
    });

    if (!customer) {
      throw new NotFoundException();
    }

    await this.customerRepository.softRemove(customer);
  }
}
