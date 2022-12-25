import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Account } from '@src/entities/account.entity';
import { OrderItem } from '@src/entities/order-item.entity';
import { Product } from '@src/entities/product.entity';
import { Seller } from '@src/entities/seller.entity';

describe('OrderItem Domain', () => {
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
  const initializeProduct = () => {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = Number(faker.commerce.price());
    const seller = initializeSeller();
    return Product.of(name, description, price, seller);
  };

  describe('of', () => {
    it('주문 항목을 생성한다.', () => {
      // given
      const product = initializeProduct();
      const count = Number(faker.random.numeric());

      // when
      const orderItem = OrderItem.of(product, count);

      // then
      expect(orderItem.product).toStrictEqual(product);
      expect(orderItem.count).toBe(count);
    });

    it('상품 개수가 0 이면, BadRequestException을 던진다.', () => {
      // given
      const product = initializeProduct();
      const count = 0;

      // when
      const createOrderItem = () => OrderItem.of(product, count);

      // then
      expect(createOrderItem).toThrowError(BadRequestException);
    });

    it('상품 개수가 0 보다 작으면, BadRequestException을 던진다.', () => {
      // given
      const product = initializeProduct();
      const count = -1;

      // when
      const createOrderItem = () => OrderItem.of(product, count);

      // then
      expect(createOrderItem).toThrowError(BadRequestException);
    });
  });
});
