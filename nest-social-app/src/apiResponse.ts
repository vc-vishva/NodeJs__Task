export interface MyCustomResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data?: T[] | object;
  error?: string;
}

export const createResponse = <T>(
  status: boolean,
  statusCode: number,
  message: string,
  data?: T[] | object,
  error?: string,
): MyCustomResponse<T> => {
  return {
    status,
    statusCode,
    message,
    data,
    error,
  };
};
