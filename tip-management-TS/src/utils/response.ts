import { Response } from "express";

export const replaceMsg = (message: string, data: string) => {
  return message.replace("response", data);
};

const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: [] | object | string,
  error?: [] | object
) => {
  return res.status(statusCode).send({ statusCode, message, data, error });
};

export default apiResponse;
