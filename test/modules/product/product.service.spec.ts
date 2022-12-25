import { faker } from '@faker-js/faker';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';
import { Order } from '@src/entities/order.entity';
import { Product } from '@src/entities/product.entity';
import { Seller } from '@src/entities/seller.entity';
import { CreateProductDto } from '@src/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@src/modules/product/dto/update-product.dto';
import { ProductQueryRepository } from '@src/modules/product/product.query-repository';
import { ProductService } from '@src/modules/product/product.service';
import { SellerQueryRepository } from '@src/modules/seller/seller.query-repository';
import { IBackup } from 'pg-mem';
import { getMemDateSource } from 'test/utils/pg-mem.util';
import { DataSource, Repository } from 'typeorm';

describe('Product Service', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let backup: IBackup;
  let productRepository: Repository<Product>;
  let productQueryRepository: ProductQueryRepository;
  let productService: ProductService;
  let sellerRepository: Repository<Seller>;
  let accountRepository: Repository<Account>;

  const initializeSeller = async () => {
    const createAccount = Account.of(
      faker.internet.email(),
      faker.phone.number('+82 10-####-####'),
      faker.internet.password(),
    );
    const account = await accountRepository.save(createAccount);
    const createSeller = Seller.of(
      faker.name.fullName(),
      faker.address.streetAddress(),
      account,
    );
    return sellerRepository.save(createSeller);
  };

  const initializeProduct = async () => {
    const seller = await initializeSeller();
    const product = Product.of(
      faker.commerce.product(),
      faker.commerce.productDescription(),
      Number(faker.commerce.price()),
      seller,
    );
    return productRepository.save(product);
  };

  beforeAll(async () => {
    await getMemDateSource([Product, Seller, Account, Order, Customer]).then(
      (data) => {
        datasource = data.datasource;
        backup = data.backup;
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Product, Seller]),
      ],
      providers: [
        SellerQueryRepository,
        ProductQueryRepository,
        ProductService,
      ],
    })
      .overrideProvider(DataSource)
      .useValue(datasource)
      .compile();

    app = module.createNestApplication();

    accountRepository = datasource.getRepository(Account);
    sellerRepository = datasource.getRepository(Seller);
    productRepository = datasource.getRepository(Product);
    productQueryRepository = module.get<ProductQueryRepository>(
      ProductQueryRepository,
    );
    productService = module.get<ProductService>(ProductService);

    await app.init();
  });

  afterEach(async () => {
    await backup.restore();
  });

  describe('createProduct', () => {
    it('상품을 생성한다.', async () => {
      // given
      const seller = await initializeSeller();
      const createProductDto: CreateProductDto = {
        sellerId: seller.id,
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
      };

      // when
      const product = await productService.createProduct(createProductDto);

      // then
      expect(product.id).toStrictEqual(expect.any(BigInt));
      expect(product.name).toBe(createProductDto.name);
      expect(product.description).toBe(createProductDto.description);
      expect(product.price).toBe(createProductDto.price);
    });
  });

  describe('findProoductById', () => {
    it('상품을 id로 검색한다.', async () => {
      // given
      const product = await initializeProduct();

      // when
      const findProduct = await productService.findProductById(product.id);

      // then
      expect(findProduct.id).toBe(product.id);
      expect(findProduct.name).toBe(product.name);
      expect(findProduct.description).toBe(product.description);
      expect(findProduct.price).toBe(product.price);
    });

    it('id로 검색된 상품이 없으면 Null 을 반환한다.', async () => {
      // given
      const productId = BigInt(faker.random.numeric());

      // when
      const findProduct = await productService.findProductById(productId);

      // then
      expect(findProduct).toBeNull();
    });
  });

  describe('findProductByNameOrDescription', () => {
    it('이름으로 상품을 검색한다.', async () => {
      // given
      const product = await initializeProduct();

      // when
      const findProducts = await productService.findProductNameOrDescription(
        product.name,
      );

      delete product['_seller'];

      // then
      expect(findProducts).toEqual(
        expect.arrayContaining([expect.objectContaining(product)]),
      );
    });

    it('설명으로 상품을 검색한다.', async () => {
      // given
      const product = await initializeProduct();

      // when
      const findProducts = await productService.findProductNameOrDescription(
        product.description,
      );

      delete product['_seller'];

      // then
      expect(findProducts).toEqual(
        expect.arrayContaining([expect.objectContaining(product)]),
      );
    });

    it('검색된 상품이 없으면 빈 배열을 반환한다.', async () => {
      // given
      const name = faker.commerce.product();

      // when
      const findProducts = await productService.findProductNameOrDescription(
        name,
      );

      // then
      expect(findProducts).toHaveLength(0);
    });
  });

  describe('updateProduct', () => {
    it('상품의 정보를 수정한다.', async () => {
      // given
      const product = await initializeProduct();

      const updateProductDto: UpdateProductDto = {
        name: faker.name.fullName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
      };

      // when
      await productService.updateProduct(product.id, updateProductDto);

      const updateProduct = await productQueryRepository.findOneById(
        product.id,
      );

      // then
      expect(updateProduct.id).toBe(product.id);
      expect(updateProduct.name).toBe(updateProductDto.name);
      expect(updateProduct.description).toBe(updateProductDto.description);
      expect(updateProductDto.price).toBe(updateProductDto.price);
    });

    it('수정할 상품이 없으면 NotFoundException을 던진다.', async () => {
      // given
      const productId = BigInt(faker.random.numeric());

      const updateProductDto: UpdateProductDto = {
        name: faker.name.fullName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
      };

      // when
      const updateProduct = () =>
        productService.updateProduct(productId, updateProductDto);

      // then
      expect(updateProduct).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteProductById', () => {
    it('상품을 삭제한다.', async () => {
      // given
      const product = await initializeProduct();

      // when
      await productService.deleteProductById(product.id);

      const deleteProduct = await productQueryRepository.findOneById(
        product.id,
      );

      // then
      expect(deleteProduct).toBeNull();
    });

    it('삭제할 상품이 없으면 NotFoundException을 던진다.', async () => {
      // given
      const productId = BigInt(faker.random.numeric());

      // when
      const deleteProduct = () => productService.deleteProductById(productId);

      // then
      expect(deleteProduct).rejects.toThrowError(NotFoundException);
    });
  });
});
