import { PrismaClient } from "@prisma/client";

const globalForThis = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForThis.prisma = prisma;
