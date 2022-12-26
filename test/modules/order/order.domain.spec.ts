import { faker } from '@faker-js/faker';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';
import { OrderItem } from '@src/entities/order-item.entity';
import { Order } from '@src/entities/order.entity';
import { Product } from '@src/entities/product.entity';
import { Seller } from '@src/entities/seller.entity';

describe('Order Domain', () => {
  const initializeAccount = () => {
    const email = faker.internet.email();
    const phone = faker.phone.number('+82 10-####-####');
    const password = faker.internet.password();

    return Account.of(email, phone, password);
  };
  const initializeSeller = () => {
    const name = faker.name.fullName();
    const address = faker.address.streetAddress();
    const account = initializeAccount();
    return Seller.of(name, address, account);
  };
  const initializeCustomer = () => {
    const name = faker.name.fullName();
    const address = faker.address.streetAddress();
    const account = initializeAccount();
    return Customer.of(name, address, account);
  };

  const initializeProduct = () => {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = Number(faker.commerce.price);
    const quantity = Number(faker.random.numeric(3));
    const seller = initializeSeller();
    return Product.of(name, description, price, quantity, seller);
  };

  const initializeOrderItem = () => {
    const product = initializeProduct();
    const count = Number(faker.random.numeric());

    return OrderItem.of(product, count);
  };

  describe('of', () => {
    it('주문을 생성한다.', async () => {
      // given
      const customer = initializeCustomer();
      const orderItems = Array.from(
        {
          length: 5,
        },
        () => initializeOrderItem(),
      );

      // when
      const order = Order.of(customer, orderItems);

      // then
      expect(order.customer).toStrictEqual(customer);
      expect(order.orderItems).toStrictEqual(orderItems);
    });
  });
});
