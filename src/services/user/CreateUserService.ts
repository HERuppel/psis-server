import { PersonModel } from "@models/domain/PersonModel";
import { CreateUserRequestModel } from "@models/dto/user/CreateUserRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { CreatePersonService } from "@services/person";

class CreateUserService extends CreatePersonService {
  constructor(
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    validatorsProvider: IValidatorsProvider
  ) {
    super(uniqueIdentifierProvider, validatorsProvider);
  }

  protected async createOperation({
    CPF,
    birthDate,
    name,
    address,
    contactNumber,
    email,
  }: CreateUserRequestModel): Promise<PersonModel> {
    await super.createOperation({
      birthDate,
      CPF,
      name,
      address,
      contactNumber,
      email,
    });
    return {} as PrismaPromise<PersonModel>;
  }
}

export { CreateUserService };