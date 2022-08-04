import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
import { transaction } from "@infra/database/transaction";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IPersonRepository } from "@repositories/person";
import { IUserRepository } from "@repositories/user";

class SoftUserDeleteService {
  private operation?: PrismaPromise<PersonModel>;

  constructor(
    private labelUserType = "usuário",
    private uniqueIdentifierProvider: IUniqueIdentifierProvider,
    private userRepository: IUserRepository,
    private personRepository: IPersonRepository
  ) {}

  protected getOperation = (): PrismaPromise<PersonModel> => {
    if (this.operation) return this.operation;

    throw new AppError(
      "INTERNAL_SERVER_ERROR",
      i18n.__("ErrorBaseCreateOperationFailed")
    );
  };

  protected getRole = (): string => {
    throw new AppError("INTERNAL_SERVER_ERROR", i18n.__("ErrorGeneric"));
  };

  protected async createOperation(clinicId: string, id: string): Promise<void> {
    if (stringIsNullOrEmpty(clinicId))
      throw new AppError("BAD_REQUEST", i18n.__("ErrorClinicRequired"));

    if (stringIsNullOrEmpty(id))
      throw new AppError(
        "BAD_REQUEST",
        i18n.__mf("ErrorUserIDRequired", [this.labelUserType])
      );

    if (
      !this.uniqueIdentifierProvider.isValid(clinicId) ||
      !this.uniqueIdentifierProvider.isValid(id)
    )
      throw new AppError("BAD_REQUEST", i18n.__("ErrorUUIDInvalid"));

    const [hasUser] = await transaction([
      this.userRepository.getToDelete(clinicId, id, this.getRole()),
    ]);

    if (!hasUser)
      throw new AppError(
        "NOT_FOUND",
        i18n.__mf("ErrorUserIDNotFound", [this.labelUserType])
      );

    this.operation = this.personRepository.safetyDelete(id);
  }
}

export { SoftUserDeleteService };
