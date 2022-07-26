import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IOwnerRepository } from "@repositories/owner/models/IOwnerRepository";

class OwnerRepository implements IOwnerRepository {
  constructor(private prisma = prismaClient) {}

  public get = ([take, skip]: [number, number]): PrismaPromise<
    Partial<OwnerModel & { person: PersonModel }>[]
  > =>
    this.prisma.user.findMany({
      select: {
        accessCode: true,
        id: true,
        userName: true,
        person: {
          select: {
            birthDate: true,
            CPF: true,
            contactNumber: true,
            email: true,
            name: true,
          },
        },
      },
      where: {
        person: { domainClass: UserDomainClasses.OWNER, active: true },
      },
      orderBy: { person: { name: "asc" } },
      take,
      skip,
    }) as PrismaPromise<Partial<OwnerModel & { person: PersonModel }>[]>;
}

export { OwnerRepository };
