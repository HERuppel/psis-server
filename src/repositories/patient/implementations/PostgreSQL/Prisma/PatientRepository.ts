import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IPatientRepository } from "@repositories/patient/models/IPatientRepository";

class PatientRepository implements IPatientRepository {
  constructor(private prisma = prismaClient) {}

  public count = (): PrismaPromise<number> =>
    this.prisma.person.count({
      where: {
        domainClass: UserDomainClasses.PATIENT,
      },
    });

  public get = ([take, skip]: [number, number]): PrismaPromise<
    Partial<PersonModel & { patient: PatientModel }>[]
  > =>
    this.prisma.person.findMany({
      where: {
        domainClass: UserDomainClasses.PATIENT,
      },
      select: {
        birthDate: true,
        contactNumber: true,
        CPF: true,
        email: true,
        name: true,
        id: true,
        patient: {
          select: {
            gender: true,
            maritalStatus: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take,
      skip,
    }) as PrismaPromise<Partial<PersonModel & { patient: PatientModel }>[]>;

  public save = (
    personId: string,
    { gender, maritalStatus }: PatientModel
  ): PrismaPromise<Partial<PatientModel>> =>
    this.prisma.patient.create({
      data: {
        gender,
        maritalStatus,
        id: personId,
      },
    });
}

export { PatientRepository };