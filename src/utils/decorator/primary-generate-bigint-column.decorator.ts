import { applyDecorators } from '@nestjs/common';
import { Generated, PrimaryColumn, PrimaryColumnOptions } from 'typeorm';

export const PrimaryGenerateBigintColumn = (
  options?: PrimaryColumnOptions,
): PropertyDecorator => {
  return applyDecorators(
    Generated('increment'),
    PrimaryColumn({
      ...options,
      type: 'bigint',
      transformer: {
        to: (value?: bigint): string => {
          try {
            return typeof value === 'bigint' ? value.toString() : value;
          } catch (err) {
            console.log(err);
          }
        },
        from: (value: string): bigint => {
          try {
            return typeof value === 'string' ? BigInt(value) : value;
          } catch (err) {
            console.log(err);
          }
        },
      },
    }),
  );
};
