export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value = new Proxy(descriptor.value, {
      async apply(target, thisArg, argArray) {
        const returnValue = await Reflect.apply(target, thisArg, argArray);
        return returnValue;
      },
    });
  };
}
