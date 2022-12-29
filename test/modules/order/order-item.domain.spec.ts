import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Account } from '@src/entities/account.entity';
import { OrderItem, OrderItemStatus } from '@src/entities/order-item.entity';
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
  const initializeProduct = (quantity = Number(faker.random.numeric())) => {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = Number(faker.commerce.price());
    const seller = initializeSeller();
    return Product.of(name, description, price, quantity, seller);
  };

  describe('of', () => {
    it('주문 항목을 생성한다.', () => {
      // given
      const product = initializeProduct(5);
      const count = 3;

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

    it('상품 개수가 주문할 개수보다 작으면 BadRequestException을 던진다.', () => {
      // given
      const product = initializeProduct();
      const count = product.quantity + 1;

      // when
      const createOrderItem = () => OrderItem.of(product, count);

      // then
      expect(createOrderItem).toThrowError(BadRequestException);
    });
  });

  describe('changeStatus', () => {
    it('주문 상태를 변경한다.', () => {
      // given
      const product = initializeProduct(5);
      const count = 2;
      const orderItem = OrderItem.of(product, count);

      // when
      orderItem.changeStatus(OrderItemStatus.CONFIRMED);

      // then
      expect(orderItem.status).toBe(OrderItemStatus.CONFIRMED);
    });

    it('주문 상태를 PENDING으로 변경하려고 하면 BadRequestException을 던진다.', () => {
      // given
      const product = initializeProduct(5);
      const count = 2;
      const orderItem = OrderItem.of(product, count);

      // when
      const changeOrderItemStatus = () =>
        orderItem.changeStatus(OrderItemStatus.PENDING);

      // then
      expect(changeOrderItemStatus).toThrowError(BadRequestException);
    });

    it('주문 상태를 CANCEL으로 변경하려고 하면 BadRequestException을 던진다.', () => {
      // given
      const product = initializeProduct(5);
      const count = 2;
      const orderItem = OrderItem.of(product, count);

      // when
      const changeOrderItemStatus = () =>
        orderItem.changeStatus(OrderItemStatus.CANCELLED);

      // then
      expect(changeOrderItemStatus).toThrowError(BadRequestException);
    });
  });

  describe('cancle', () => {
    it('주문 항목 상태가 준비중이면 취소된다.', () => {
      // given
      const product = initializeProduct(5);
      const count = 2;
      const orderItem = OrderItem.of(product, count);

      // when
      orderItem.cancle();

      // then
      expect(orderItem.status).toBe(OrderItemStatus.CANCELLED);
    });
  });
});
