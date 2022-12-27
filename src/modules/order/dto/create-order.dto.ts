export class CreateOrderDto {
  orderItems: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  productId: bigint;
  count: number;
}
