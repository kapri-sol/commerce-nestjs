import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseBigintPipe } from '@src/utils/pipe/parse-bigint.pipe';
import { CustomerService } from './customer.service';
import { FindCustomerResponseDto } from './dto/response.dto';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':customerId')
  async findCustomer(
    @Param('customerId', ParseBigintPipe) customerId: bigint,
  ): Promise<FindCustomerResponseDto> {
    const { name, address } = await this.customerService.findCustomerById(
      customerId,
    );

    return {
      name,
      address,
    };
  }
}
