import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from '@src/entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellerQueryRepository {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  findOneById(id: bigint) {
    return this.sellerRepository
      .createQueryBuilder()
      .where('id = :id', {
        id: id.toString(),
      })
      .where('deleted_at is null')
      .getOne();
  }
}
