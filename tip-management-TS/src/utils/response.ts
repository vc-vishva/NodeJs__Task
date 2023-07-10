import { Response } from "express";

const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: [] | object,
  error?: [] | object
) => {
  return res.status(statusCode).send({ statusCode, message, data, error });
};

export default apiResponse;
