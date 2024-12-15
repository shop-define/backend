import { prismaClient } from '../../../libs/db/prisma-client';

export async function getRecipientByUserId(userId: number) {
  return await prismaClient.recipient.findUnique({
    where: {
      userId,
    },
  });
}
