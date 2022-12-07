import { PickType } from '@nestjs/swagger';
import { Account } from '@src/entity/account.entity';

export class FindAccountResponseDto extends PickType(Account, [
  'email',
  'phone',
]) {}

export class CreateAccountResponseDto {
  id: string;
}
