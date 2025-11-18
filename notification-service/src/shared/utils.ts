import { Prisma } from "@prisma/client";

export const toJson = (v: unknown) =>
  JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
