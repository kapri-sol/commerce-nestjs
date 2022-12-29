import { faker } from '@faker-js/faker';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';
import { OrderItem, OrderItemStatus } from '@src/entities/order-item.entity';
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

describe('Order Service', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let backup: IBackup;
  let accountRepository: Repository<Account>;
  let sellerRepostitory: Repository<Seller>;
  let customerRepository: Repository<Customer>;
  let productRepository: Repository<Product>;
  let orderItemRepository: Repository<OrderItem>;
  let orderItemQueryRepository: OrderItemQueryRepository;
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
    return OrderItem.of(product, count);
  };
  const initializeOrder = async (customer?: Customer) => {
    if (!customer) {
      customer = await initializeCustomer();
    }

    const orderItem = await initializeOrderItem();
    const orderItem2 = await initializeOrderItem();
    const orderItem3 = await initializeOrderItem();

    return Order.of(customer, [orderItem, orderItem2, orderItem3]);
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
    orderItemQueryRepository = module.get<OrderItemQueryRepository>(
      OrderItemQueryRepository,
    );
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
      const orderItem2 = await initializeOrderItem();
      const orderItem3 = await initializeOrderItem();

      const createOrderDto: CreateOrderDto = {
        orderItems: [
          {
            productId: orderItem.product.id,
            count: orderItem.count,
          },

          {
            productId: orderItem2.product.id,
            count: orderItem2.count,
          },
          {
            productId: orderItem3.product.id,
            count: orderItem3.count,
          },
        ],
      };

      // when
      const orderId = await orderService.createOrder(
        customer.id,
        createOrderDto,
      );

      const findOrder = await orderQueryRepository.findOneById(orderId);

      // then
      expect(findOrder.id).toBe(orderId);
      expect(findOrder.orderItems.length).toBe(
        createOrderDto.orderItems.length,
      );
    });
  });

  describe('findOrder', () => {
    it('주문을 id로 검색한다.', async () => {
      // given
      const order = await initializeOrder();
      const { id: orderId } = await orderRepository.save(order);

      // when
      const findOrder = await orderService.findOrder(orderId);

      // then
      expect(findOrder.id).toBe(orderId);
    });
  });

  describe('findOrders', () => {
    it('주문을 고객 id로 검색한다.', async () => {
      // given
      const customer = await initializeCustomer();
      const order = await initializeOrder(customer);
      const order2 = await initializeOrder(customer);
      const order3 = await initializeOrder(customer);

      await orderRepository.save([order, order2, order3]);

      // when
      const findOrders = await orderService.findOrders(customer.id);

      // then

      expect(findOrders.length).toBe(3);
    });
  });

  describe('cancelOrderItem', () => {
    it('주문 항목을 id로 취소한다.', async () => {
      // given
      const customer = await initializeCustomer();
      const order = await initializeOrder(customer);
      const createOrder = await orderRepository.save(order);
      const orderItem = createOrder.orderItems[0];

      // when
      await orderService.cancleOrderItem(orderItem.id);

      const cancelOrderItem = await orderItemQueryRepository.findOneById(
        orderItem.id,
      );

      // then
      expect(cancelOrderItem.id).toBe(orderItem.id);
      expect(cancelOrderItem.status).toBe(OrderItemStatus.CANCELLED);
    });

    it('상태가 PENDING이면, 주문 항목을 id로 취소할 때, BadRequestException을 던진다 .', async () => {
      // given
      const customer = await initializeCustomer();
      const order = await initializeOrder(customer);
      const createOrder = await orderRepository.save(order);
      const orderItem = createOrder.orderItems[0];

      // when
      const cancleOrderItem = () => orderService.cancleOrderItem(orderItem.id);

      // then
      expect(cancleOrderItem).toThrowError(BadRequestException);
    });
  });
});
