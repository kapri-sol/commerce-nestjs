import { ApiProperty } from '@nestjs/swagger';

export class FindAccountResponseDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
}

export class CreateAccountResponseDto {
  id: string;
}
