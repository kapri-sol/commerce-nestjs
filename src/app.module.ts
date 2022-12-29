import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { NODE_ENV } from './utils/common/env.enum';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { Account } from './entities/account.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { Seller } from './entities/seller.entity';
import { OrderItem } from './entities/order-item.entity';

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
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      synchronize: process.env.NODE_ENV !== NODE_ENV.PRODUCTION,
      logging: process.env.NODE_ENV === NODE_ENV.DEVELOPMENT,
      entities: [Account, Customer, Order, Product, Seller, OrderItem],
    }),
    AccountModule,
    CustomerModule,
    AuthModule,
  ],
})
export class AppModule {}
