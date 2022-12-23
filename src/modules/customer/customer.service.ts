import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '@src/entities/customer.entity';
import { AccountQueryRepository } from '../account/account.query-repository';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dto/create.dto';
import { UpdateCustomerDto } from './dto/update.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly accountQueryRepository: AccountQueryRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  /**
   * 고객을 생성한다.
   *
   * @param {CreateCustomerDto} createCustomerDto
   * @return {*}  {Promise<bigint>}
   * @memberof CustomerService
   */
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<bigint> {
    const { name, address } = createCustomerDto;
    const account = await this.accountQueryRepository.findOneById(
      createCustomerDto.accountId,
    );

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
    const customer = await this.customerRepository.findOneById(customerId);

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
   * @memberof CustomerService
   */
  async updateCustomer(
    customerId: bigint,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerRepository.findOneById(customerId);

    if (!customer) {
      throw new NotFoundException();
    }

    const { name, address } = updateCustomerDto;

    customer.changeName(name);
    customer.changeAddress(address);

    await this.customerRepository.save(customer);
  }

  /**
   * 고객정보를 제거한다.
   *
   * @param {bigint} customerId
   * @memberof CustomerService
   */
  async removeCustomeById(customerId: bigint) {
    const customer = await this.customerRepository.findOneById(customerId);

    if (!customer) {
      throw new NotFoundException();
    }

    await this.customerRepository.softRemove(customer);
  }
}
