import { Request, Response } from "express";
import i18n from "i18n";
import { container } from "tsyringe";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { HttpStatus, IPaginationResponse, IResponseMessage } from "@infra/http";
import { PatientModel } from "@models/domain/PatientModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import {
  CreatePatientService,
  ListPatientsService,
  SoftPatientDeleteService,
} from "@services/patient";

class PatientController {
  public async create(
    req: Request,
    res: Response<IResponseMessage<Partial<PatientModel>>>
  ): Promise<Response> {
    try {
      const {
        email,
        name,
        CPF,
        birthDate,
        contactNumber,
        address,
        clinicId,
        gender,
        maritalStatus,
        liableRequired,
        liable,
      } = req.body;

      const createPatientService = container.resolve(CreatePatientService);

      const result = await createPatientService.execute(
        {
          email,
          name,
          birthDate,
          CPF,
          contactNumber,
          gender,
          maritalStatus,
          clinicId,
          address: address
            ? {
                state: address.state,
                zipCode: address.zipCode,
                city: address.city,
                district: address.district,
                publicArea: address.publicArea,
              }
            : undefined,
        },
        liableRequired === true
          ? stringIsNullOrEmpty(liable.id)
            ? {
                birthDate: liable.birthDate,
                CPF: liable.CPF,
                contactNumber: liable.contactNumber,
                name: liable.name,
                email: liable.email,
                clinicId,
              }
            : liable.id
          : null
      );

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
      IResponseMessage<IPaginationResponse<ListPatientsResponseModel>>
    >
  ): Promise<Response> {
    try {
      const { page, size } = req.query;
      const { id: clinicId } = req.clinic;

      const listPatientsService = container.resolve(ListPatientsService);

      const result = await listPatientsService.execute(clinicId, {
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

  public async delete(
    req: Request,
    res: Response<IResponseMessage<boolean>>
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { id: clinicId } = req.clinic;

      const softDeleteService = container.resolve(SoftPatientDeleteService);

      const result = await softDeleteService.execute(clinicId, id);

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

export { PatientController };
