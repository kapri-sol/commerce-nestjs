import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Account } from '@src/entities/account.entity';
import { Product } from '@src/entities/product.entity';
import { Seller } from '@src/entities/seller.entity';

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

const initializeProduct = (quantity = Number(faker.commerce.price())) => {
  const name = faker.name.fullName();
  const description = faker.commerce.productDescription();
  const price = Number(faker.commerce.price());
  const seller = initializeSeller();
  return Product.of(name, description, price, quantity, seller);
};

describe('Product Domain', () => {
  describe('of', () => {
    it('상품을 생성한다.', () => {
      // given
      const name = faker.name.fullName();
      const description = faker.commerce.productDescription();
      const price = Number(faker.commerce.price());
      const quantity = Number(faker.commerce.price());
      const seller = initializeSeller();

      // when
      const product = Product.of(name, description, price, quantity, seller);

      // then
      expect(product.name).toBe(name);
      expect(product.description).toBe(description);
      expect(product.price).toBe(price);
      expect(product.quantity).toBe(quantity);
      expect(product.seller).toStrictEqual(seller);
    });

    it('상품 수량이 0 일 때, BadRequestException을 던진다.', () => {
      // given
      const name = faker.name.fullName();
      const description = faker.commerce.productDescription();
      const price = Number(faker.commerce.price());
      const quantity = 0;
      const seller = initializeSeller();

      // when
      const createProduct = () =>
        Product.of(name, description, price, quantity, seller);

      // then
      expect(createProduct).toThrowError(BadRequestException);
    });

    it('상품 수량이 0 보다 작을 때, BadRequestException을 던진다.', () => {
      // given
      const name = faker.name.fullName();
      const description = faker.commerce.productDescription();
      const price = Number(faker.commerce.price());
      const quantity = -1;
      const seller = initializeSeller();

      // when
      const createProduct = () =>
        Product.of(name, description, price, quantity, seller);

      // then
      expect(createProduct).toThrowError(BadRequestException);
    });
  });

  describe('isQuantityOrderable', () => {
    it('상품 수량이 주문할 수량보다 많으면 true를 반환한다.', () => {
      // given
      const product = initializeProduct(100);
      const count = 2;

      // when
      const isQuantityOrderable = product.isQuantityOrderable(count);

      // then
      expect(isQuantityOrderable).toBe(true);
    });

    it('상품 수량이 주문할 수량보다 적으면 false를 반환한다.', () => {
      // given
      const product = initializeProduct(10);
      const count = 11;

      // when
      const isQuantityOrderable = product.isQuantityOrderable(count);

      // then
      expect(isQuantityOrderable).toBe(false);
    });
  });
  describe('order', () => {
    it('상품을 주문하면 수량이 감소한다.', () => {
      // given
      const productQuantity = 2;
      const orderCount = 2;
      const product = initializeProduct(productQuantity);

      // when
      product.order(orderCount);

      // then
      expect(product.quantity).toBe(productQuantity - orderCount);
    });

    it('상품을 수량보다 많은 수를 주문하면 BadRequestException을 던진다.', () => {
      // given
      const productQuantity = 2;
      const orderCount = 3;
      const product = initializeProduct(productQuantity);

      // when
      const orderProdct = () => product.order(orderCount);

      // then
      expect(orderProdct).toThrowError(BadRequestException);
    });
  });
});
