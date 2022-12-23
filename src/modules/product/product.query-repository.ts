import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductQueryRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findProductById(id: bigint): Promise<Product> {
    return this.productRepository
      .createQueryBuilder()
      .where('product.product_id = :id', {
        id: id.toString(),
      })
      .where('product.deleted_at is null')
      .getOne();
  }

  findProductsByName(name: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder()
      .select()
      .where('product.name like %:name%', { name })
      .where('product.deleted_at is null')
      .getMany();
  }
}
