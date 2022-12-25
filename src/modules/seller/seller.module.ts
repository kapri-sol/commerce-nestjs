import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from '@src/entities/seller.entity';
import { SellerQueryRepository } from './seller.query-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  providers: [SellerQueryRepository],
  exports: [SellerQueryRepository],
})
export class SellerModule {}
