import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";

interface ILiableRepository {
  save(patientId: string, liableId: string): PrismaPromise<any>;
  hasLiablePersonSaved(
    id: string
  ): PrismaPromise<(any & { person: PersonModel }) | null>;
  get(
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<(any & { person: Partial<PersonModel> })[]>;
}

export { ILiableRepository };
