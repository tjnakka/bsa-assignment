export class CustomResponse {
  isError = false;
  data = {};
  message = '';
}

export function Response() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let response = new CustomResponse();

      try {
        args[0] = response;
        await value.apply(this, args);
      } catch (error) {
        response.isError = true;
        response.message = error;
      }

      return response;
    };
  };
}
