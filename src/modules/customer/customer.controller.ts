import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseBigintPipe } from '@src/utils/pipe/parse-bigint.pipe';
import { CustomerService } from './customer.service';
import { FindCustomerResponse } from './dto/find-customer.response';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':customerId')
  async findCustomer(
    @Param('customerId', ParseBigintPipe) customerId: bigint,
  ): Promise<FindCustomerResponse> {
    const { name, address } = await this.customerService.findCustomerById(
      customerId,
    );

    return {
      name,
      address,
    };
  }
}
