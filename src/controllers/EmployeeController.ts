import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { ListEmployeesResponseModel } from "@models/dto/employee/ListEmployeesResponseModel";
import {
  CreateEmployeeService,
  ListEmployeesService,
} from "@services/employee";

class EmployeeController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<EmployeeModel>>>
  ): Promise<Response> {
    try {
      const {
        user_name: userName,
        password,
        email,
        name,
        CPF,
        birth_date: birthDate,
        contact_number: contactNumber,
        address,
        clinicId,
      } = req.body;

      const createEmployeeService = container.resolve(CreateEmployeeService);

      const result = await createEmployeeService.execute({
        userName,
        birthDate: new Date(birthDate),
        contactNumber,
        name,
        CPF,
        email,
        password,
        clinicId,
        address: address
          ? {
              state: address.state,
              zipCode: address.zip_code,
              city: address.city,
              district: address.district,
              publicArea: address.public_area,
            }
          : undefined,
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        content: result,
        message: i18n.__("SuccessGeneric"),
      });
    } catch (error) {
      return res.status(AppError.getErrorStatusCode(error)).json({
        success: false,
        message: AppError.getErrorMessage(error),
      });
    }
  }

  public async read(
    req: Request,
    res: Response<
      IResponseMessage<IPaginationResponse<ListEmployeesResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { clinic_id: clinicId } = req.params;

      const listEmployeesService = container.resolve(ListEmployeesService);

      const result = await listEmployeesService.execute(clinicId, {
        page,
        size,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        content: result,
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

export { EmployeeController };
