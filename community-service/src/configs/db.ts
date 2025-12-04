import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function testConnection() {
  const subs = await prisma.community.findMany();
  // console.log(subs);
}

testConnection();
