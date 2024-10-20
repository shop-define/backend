import { prismaClient } from '../../../libs/db/prisma-client';

export async function getAccountProfile(id: number) {
  const user = await prismaClient.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  return user;
}

export async function createAccount({ email }: { email?: string }) {
  const user = await prismaClient.user.upsert({
    where: { email: email },
    update: { email: email },
    create: { email: email },
  });

  return user;
}
