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

  findOneById(id: bigint): Promise<Product> {
    return this.productRepository
      .createQueryBuilder()
      .where('id = :id', {
        id: id.toString(),
      })
      .where('deleted_at is null')
      .getOne();
  }

  findByNameOrDescription(content: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder()
      .select()
      .where('deleted_at is null')
      .where('name like :name', { name: `%${content}%` })
      .orWhere('description like :description', {
        description: `%${content}%`,
      })
      .getMany();
  }
}
