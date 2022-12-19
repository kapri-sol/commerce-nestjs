import { ApiProperty } from '@nestjs/swagger';

export class FindAccountResponse {
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
}
