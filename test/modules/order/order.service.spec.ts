import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { Product } from '@src/entities/product.entity';
import { Seller } from '@src/entities/seller.entity';
import { CreateOrderDto } from '@src/modules/order/dto/create-order.dto';
import { OrderItemQueryRepository } from '@src/modules/order/order-item.query-repository';
import { OrderQueryRepository } from '@src/modules/order/order.query-repository';
import { OrderService } from '@src/modules/order/order.service';
import { ProductQueryRepository } from '@src/modules/product/product.query-repository';
import { IBackup } from 'pg-mem';
import { getMemDateSource } from 'test/utils/pg-mem.util';
import { DataSource, Repository } from 'typeorm';
import { inspect } from 'util';

describe('Order Service', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let backup: IBackup;
  let accountRepository: Repository<Account>;
  let sellerRepostitory: Repository<Seller>;
  let customerRepository: Repository<Customer>;
  let productRepository: Repository<Product>;
  let orderItemRepository: Repository<OrderItem>;
  let orderQueryRepository: OrderQueryRepository;
  let orderRepository: Repository<Order>;
  let orderService: OrderService;

  const initializeAccount = () => {
    const email = faker.internet.email();
    const phone = faker.phone.number('+82 10-####-####');
    const password = faker.internet.password();
    const account = Account.of(email, phone, password);
    return accountRepository.save(account);
  };
  const initializeSeller = async () => {
    const name = faker.name.fullName();
    const address = faker.address.streetAddress();
    const account = await initializeAccount();
    const seller = Seller.of(name, address, account);
    return sellerRepostitory.save(seller);
  };
  const initializeCustomer = async () => {
    const name = faker.name.fullName();
    const address = faker.address.streetAddress();
    const account = await initializeAccount();
    const customer = Customer.of(name, address, account);
    return customerRepository.save(customer);
  };
  const initializeProduct = async (
    quantity = Number(faker.random.numeric()),
  ) => {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = Number(faker.commerce.price());
    const seller = await initializeSeller();
    const product = Product.of(name, description, price, quantity, seller);
    return productRepository.save(product);
  };
  const initializeOrderItem = async () => {
    const count = Number(faker.random.numeric());
    const productQuantity = count + Number(faker.random.numeric());
    const product = await initializeProduct(productQuantity);
    const orderItem = OrderItem.of(product, count);
    return orderItemRepository.save(orderItem);
  };
  beforeAll(async () => {
    await getMemDateSource([
      Product,
      Seller,
      Account,
      Order,
      Customer,
      OrderItem,
    ]).then((data) => {
      datasource = data.datasource;
      backup = data.backup;
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Order, OrderItem, Product, Customer, Seller]),
      ],
      providers: [
        ProductQueryRepository,
        OrderService,
        OrderQueryRepository,
        OrderItemQueryRepository,
      ],
    })
      .overrideProvider(DataSource)
      .useValue(datasource)
      .compile();

    app = module.createNestApplication();

    accountRepository = datasource.getRepository(Account);
    sellerRepostitory = datasource.getRepository(Seller);
    customerRepository = datasource.getRepository(Customer);
    productRepository = datasource.getRepository(Product);
    orderItemRepository = datasource.getRepository(OrderItem);
    orderRepository = datasource.getRepository(Order);
    orderQueryRepository =
      module.get<OrderQueryRepository>(OrderQueryRepository);
    orderService = module.get<OrderService>(OrderService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await backup.restore();
  });

  describe('createOrder', () => {
    it('주문을 생성한다.', async () => {
      // given
      const customer = await initializeCustomer();

      const orderItem = await initializeOrderItem();

      const createOrderDto: CreateOrderDto = {
        orderItems: [
          {
            productId: orderItem.product.id,
            count: orderItem.count,
          },
        ],
      };

      // when
      const order = await orderService.createOrder(customer.id, createOrderDto);

      // const createOrder = await orderQueryRepository.findOneById(order.id);

      // then
      // console.log(createOrder);
    });
  });
});
