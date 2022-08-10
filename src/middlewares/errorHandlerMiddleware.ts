import { NextFunction, Request, Response } from "express";

import { i18n } from "@config/i18n";
import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";

const errorHandlerMiddleware = async (
  err: Error,
  _: Request,
  res: Response<IResponseMessage>,
  __: NextFunction
): Promise<void | Response> => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: i18n.__("ErrorGenericUnknown"),
  });
};

export { errorHandlerMiddleware };
