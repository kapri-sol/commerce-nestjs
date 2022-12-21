import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { NODE_ENV } from './utils/common/env.enum';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid(
          NODE_ENV.PRODUCTION,
          NODE_ENV.TEST,
          NODE_ENV.DEVELOPMENT,
        ),
        PORT: Joi.string().default('3000'),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      synchronize: process.env.NODE_ENV !== NODE_ENV.PRODUCTION,
      logging: process.env.NODE_ENV === NODE_ENV.DEVELOPMENT,
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
    }),
    AccountModule,
    CustomerModule,
    AuthModule,
  ],
})
export class AppModule {}
