import { prismaClient } from "@infra/database/client";
import { AppointmentStatus } from "@infra/domains";
import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IAppointmentRepository } from "@repositories/appointment/models/IAppointmentRepository";

class AppointmentRepository implements IAppointmentRepository {
  constructor(private prisma = prismaClient) {}

  public hasAppointment = (
    professionalId: string,
    startDate: Date,
    endDate: Date
  ): PrismaPromise<
    | (Partial<AppointmentModel> & {
        patient: Partial<PatientModel> & { person: Partial<PersonModel> };
      })
    | null
  > =>
    this.prisma.appointment.findFirst({
      where: {
        professionalId,
        AND: [
          {
            status: {
              in: [AppointmentStatus.COMPLETED, AppointmentStatus.SCHEDULED],
            },
          },
          { appointmentDate: { lt: endDate } },
          { appointmentDate: { gte: startDate } },
        ],
      },
      select: {
        appointmentDate: true,
        id: true,
        patient: {
          select: {
            person: {
              select: { name: true },
            },
          },
        },
      },
    }) as PrismaPromise<
      | (Partial<AppointmentModel> & {
          patient: Partial<PatientModel> & { person: Partial<PersonModel> };
        })
      | null
    >;

  public saveAppointment = (
    professionalId: string,
    employeeId: string,
    patientId: string,
    { appointmentDate, id, status, updatedAt }: AppointmentModel
  ): PrismaPromise<AppointmentModel> =>
    this.prisma.appointment.create({
      data: {
        id,
        appointmentDate,
        status,
        employeeId,
        professionalId,
        patientId,
        updatedAt,
      },
    }) as PrismaPromise<AppointmentModel>;

  public getAppointmentDatesByStatus = (
    professionalId: string,
    startDate: Date,
    today: Date,
    statusList: number[]
  ): PrismaPromise<{ id: string; appointmentDate: Date }[]> =>
    this.prisma.appointment.findMany({
      where: {
        professionalId,
        appointmentDate: {
          lte: today,
          gte: startDate,
        },
        status: { in: statusList },
      },
      select: { id: true, appointmentDate: true },
    });

  get = (
    professionalId: string,
    startDate: Date,
    endDate: Date,
    today: Date,
    toIgnore: { id: string; appointmentDate: Date }[]
  ): PrismaPromise<
    Partial<AppointmentModel> & { patient: { person: Partial<PersonModel> } }[]
  > =>
    this.prisma.appointment.findMany({
      where: {
        professionalId,
        appointmentDate: {
          lte: endDate,
          gte: startDate,
        },
        OR: [
          {
            appointmentDate: { lte: today },
            status: {
              in: [
                AppointmentStatus.SCHEDULED,
                AppointmentStatus.COMPLETED,
                AppointmentStatus.CONFIRMED,
              ],
            },
          },
          {
            appointmentDate: {
              lte: today,
              notIn: toIgnore.map(({ appointmentDate }) => appointmentDate),
            },
            status: {
              in: [AppointmentStatus.CANCELED, AppointmentStatus.ABSENCE],
            },
          },
          {
            appointmentDate: { gt: today },
            status: {
              notIn: [AppointmentStatus.CANCELED, AppointmentStatus.ABSENCE],
            },
          },
        ],
      },
      select: {
        id: true,
        status: true,
        appointmentDate: true,
        updatedAt: true,
        patient: {
          select: {
            person: {
              select: { name: true },
            },
          },
        },
      },
    });

  public findToUpdateStatus = (
    id: string
  ): PrismaPromise<{
    id: string;
    status: number;
    appointmentDate: Date;
    professional: { baseDuration: number };
  } | null> =>
    this.prisma.appointment.findFirst({
      where: { id },
      select: {
        id: true,
        status: true,
        appointmentDate: true,
        professional: {
          select: {
            baseDuration: true,
          },
        },
      },
    });

  public updateStatus = (
    id: string,
    status: number,
    updatedAt: Date
  ): PrismaPromise<
    Partial<AppointmentModel> & { patient: { person: Partial<PersonModel> } }
  > =>
    this.prisma.appointment.update({
      where: { id },
      data: { status, updatedAt },
      select: {
        id: true,
        status: true,
        appointmentDate: true,
        updatedAt: true,
        patient: {
          select: {
            person: {
              select: { name: true },
            },
          },
        },
      },
    });

  public findToUpdateComment = (
    id: string,
    professionalId: string
  ): PrismaPromise<Partial<AppointmentModel> | null> =>
    this.prisma.appointment.findFirst({
      where: {
        id,
        professionalId,
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED],
        },
      },
      select: { id: true },
    });

  public getAllUncompletedAppointments = (
    entity: "patient" | "professional",
    id: string,
    date: Date
  ): PrismaPromise<{ patient: { person: Partial<PersonModel> } }[]> =>
    this.prisma.appointment.findMany({
      where: {
        [`${entity}Id`]: id,
        appointmentDate: { gte: date },
      },
      select: {
        patient: {
          select: {
            person: {
              select: {
                name: true,
                contactNumber: true,
                email: true,
              },
            },
          },
        },
      },
    }) as PrismaPromise<{ patient: { person: Partial<PersonModel> } }[]>;

  public deleteAllUncompletedAppointments = (
    entity: "patient" | "professional",
    id: string,
    date: Date
  ): PrismaPromise<{ count: number }> =>
    this.prisma.appointment.deleteMany({
      where: {
        [`${entity}Id`]: id,
        appointmentDate: { gte: date },
      },
    });

  public getById = (
    professionalId: string,
    appointmentId: string
  ): PrismaPromise<AppointmentModel | null> =>
    this.prisma.appointment.findFirst({
      where: {
        professionalId,
        id: appointmentId,
      },
      select: {
        id: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
        appointmentDate: true,
        status: true,
      },
    }) as PrismaPromise<AppointmentModel | null>;
}

export { AppointmentRepository };
