import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";

interface IUserRepository {
  hasUserName(userName: string): PrismaPromise<UserModel | null>;
  save(roleId: number, user: UserModel): PrismaPromise<Partial<UserModel>>;
  count(domainClass: string): PrismaPromise<number>;
}

export { IUserRepository };
