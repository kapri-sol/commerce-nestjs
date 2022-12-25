import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/entities/product.entity';
import { SellerModule } from '../seller/seller.module';
import { ProductQueryRepository } from './product.query-repository';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SellerModule],
  providers: [ProductQueryRepository, ProductService],
  exports: [ProductQueryRepository, ProductService],
})
export class ProductModule {}
