import { PrimaryGenerateBigintColumn } from '@src/utils/decorator/primary-generate-bigint-column.decorator';
import { Entity } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGenerateBigintColumn()
  id: bigint;
}
