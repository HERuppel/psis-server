import { Request, Response } from "express";
import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IResponseMessage } from "@infra/http";

class AuthController {
  public async login(
    req: Request,
    res: Response<IResponseMessage>
  ): Promise<Response> {
    try {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }
}

export { AuthController };
