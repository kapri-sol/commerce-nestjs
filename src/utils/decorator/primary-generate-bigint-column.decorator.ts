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
          return typeof value === 'bigint' ? value.toString() : value;
        },
        from: (value: string | number): bigint => {
          return typeof value === 'string' || typeof value === 'number'
            ? BigInt(value)
            : value;
        },
      },
    }),
  );
};
