import config from "@app/config/index.js";
import AppError from "@app/error/AppError.js";
import prisma from "@app/utils/prisma.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import type { Prisma } from "../../../generated/prisma/index.js";

type RegistrationPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: {
    street?: string;
    city: string;
    country?: string;
    postalCode?: string;
  };
};

const createUser = async (payload: RegistrationPayload) => {
  try {
    const isExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
      include: {
        verifications: {
          select: {
            status: true,
          },
        },
      },
    });

    if (isExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        "User already exists",
      );
    }

    // password handle
    const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
    const hasPassword = await bcrypt.hash(payload.password, saltRounds);

    const data: Prisma.UserCreateInput = {
      name: payload.name,
      email: payload.email,
      password: hasPassword,
      phoneNumber: payload.phone ?? null,
    };

    if (payload.address) {
      data.addresses = {
        create: {
          addressLine1: payload.address.street ?? payload.address.city,
          city: payload.address.city,
          ...(payload.address.street !== undefined && {
            street: payload.address.street,
          }),
          ...(payload.address.country !== undefined && {
            country: payload.address.country,
          }),
          ...(payload.address.postalCode !== undefined && {
            postalCode: payload.address.postalCode,
          }),
        },
      };
    }

    const result = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        profile: true,
        role: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return result;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
};

export const userService = {
  createUser,
};
