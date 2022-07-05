import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";

interface IClinicRepository {
  save(clinic: Omit<ClinicModel, "code">): PrismaPromise<ClinicModel>;
  hasEmail(email: string): PrismaPromise<ClinicModel>;
  get([take, skip]: [number, number]): PrismaPromise<
    Omit<ClinicModel, "password">[]
  >;
  count(): PrismaPromise<number>;
}

export { IClinicRepository };
