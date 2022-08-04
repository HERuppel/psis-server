import { inject, injectable } from "tsyringe";

import { RolesKeys } from "@common/RolesKeys";
import { transaction } from "@infra/database/transaction";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IPersonRepository } from "@repositories/person";
import { IUserRepository } from "@repositories/user";
import { SoftUserDeleteService } from "@services/user";

@injectable()
class SoftProfessionalDeleteService extends SoftUserDeleteService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("UserRepository")
    userRepository: IUserRepository,
    @inject("PersonRepository")
    personRepository: IPersonRepository
  ) {
    super(
      "profissional",
      uniqueIdentifierProvider,
      userRepository,
      personRepository
    );
  }

  protected getRole = (): string => RolesKeys.PROFESSIONAL;

  public async execute(clinicId: string, id: string): Promise<boolean> {
    await super.createOperation(clinicId, id);

    const [deleted] = await transaction([this.getOperation()]);

    return !!deleted;
  }
}

export { SoftProfessionalDeleteService };
