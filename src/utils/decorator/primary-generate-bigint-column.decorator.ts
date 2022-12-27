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
          console.log('to', value);

          return typeof value === 'bigint' ? value.toString() : value;
        },
        from: (value: string | number): bigint => {
          console.log('from', value);
          return typeof value === 'string' || typeof value === 'number'
            ? BigInt(value)
            : value;
        },
      },
    }),
  );
};
