import { prismaClient } from '../../../libs/db/prisma-client';

export async function getBasketByGoodId(goodId: string, userId: number) {
  return await prismaClient.basketItem.findUnique({
    where: {
      userId_goodId: {
        goodId,
        userId,
      },
    },
  });
}

export async function getBasket(offset: number, limit: number, userId: number) {
  return await prismaClient.basketItem.findMany({
    where: {
      userId,
    },
    skip: offset,
    take: limit,
  });
}

export async function getTotalBasketItems(userId: number) {
  return await prismaClient.basketItem.count({
    where: {
      userId,
    },
  });
}

export async function createBasket(goodId: string, count: number, userId: number) {
  return await prismaClient.basketItem.upsert({
    where: {
      userId_goodId: {
        goodId,
        userId,
      },
    },
    update: { count },
    create: { goodId, userId, count },
  });
}

export async function deleteBasketByGoodId(goodId: string, userId: number) {
  return await prismaClient.basketItem.delete({
    where: {
      userId_goodId: {
        goodId,
        userId,
      },
    },
  });
}
