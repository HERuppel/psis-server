import { WeeklyScheduleLockModel } from "@models/domain/WeeklyScheduleLockModel";
import { WeeklyScheduleModel } from "@models/domain/WeeklyScheduleModel";
import { PrismaPromise } from "@prisma/client";

interface IScheduleRepository {
  saveWeeklyScheduleItem(
    professionalId: string,
    schedule: WeeklyScheduleModel
  ): PrismaPromise<WeeklyScheduleModel>;
  saveWeeklyScheduleLockItem(
    weeklyScheduleId: string,
    lock: WeeklyScheduleLockModel
  ): PrismaPromise<WeeklyScheduleLockModel>;
  getWeeklySchedule(
    professionalId: string
  ): PrismaPromise<
    (WeeklyScheduleModel & { WeeklyScheduleLocks: WeeklyScheduleLockModel[] })[]
  >;
  hasLock(
    professionalId: string,
    weeklyScheduleId: string,
    weeklyScheduleLockId: string
  ): PrismaPromise<WeeklyScheduleLockModel | null>;
  hasWeeklySchedule(
    id: string,
    professionalId: string
  ): PrismaPromise<WeeklyScheduleModel | null>;
  updateSchedule(
    weeklySchedule: WeeklyScheduleModel
  ): PrismaPromise<WeeklyScheduleModel>;
  deleteLock(id: string): PrismaPromise<WeeklyScheduleLockModel>;
  hasConflictingLock(
    weeklyScheduleId: string,
    startTime: Date,
    endTime: Date
  ): PrismaPromise<
    | (WeeklyScheduleLockModel & {
        weeklySchedule: Partial<WeeklyScheduleModel>;
      })
    | null
  >;
}

export { IScheduleRepository };