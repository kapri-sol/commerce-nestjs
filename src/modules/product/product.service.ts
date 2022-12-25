import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@src/entities/product.entity';
import { Repository } from 'typeorm';
import { SellerQueryRepository } from '../seller/seller.query-repository';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
import { ProductQueryRepository } from './product.query-repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly sellerQueryRepository: SellerQueryRepository,
    private readonly productQueryRepository: ProductQueryRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findProductById(productId: bigint) {
    return this.productQueryRepository.findOneById(productId);
  }

  findProductNameOrDescription(content: string) {
    return this.productQueryRepository.findByNameOrDescription(content);
  }

  async createProduct(createProductDto: CreateProductDto) {
    const seller = await this.sellerQueryRepository.findOneById(
      createProductDto.sellerId,
    );

    if (!seller) {
      throw new BadRequestException();
    }

    const { name, description, price } = createProductDto;

    const product = Product.of(name, description, price, seller);

    return this.productRepository.save(product);
  }

  async updateProduct(productId: bigint, updateProductDto: UpdateProductDto) {
    const product = await this.productQueryRepository.findOneById(productId);

    if (!product) {
      throw new NotFoundException();
    }

    const { name, description, image, price } = updateProductDto;

    product.update(name, description, price, image);

    return this.productRepository.save(product);
  }

  async deleteProductById(productId: bigint) {
    const product = await this.productQueryRepository.findOneById(productId);

    if (!product) {
      throw new NotFoundException();
    }

    await this.productRepository.softRemove(product);
  }
}
