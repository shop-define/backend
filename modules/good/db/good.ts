import { prismaClient } from '../../../libs/db/prisma-client';

export async function getGoodById(id: string) {
  const good = await prismaClient.good.findUnique({
    where: {
      id,
    },
  });

  return good;
}

export async function getGoods(offset: number, limit: number) {
  const categories = await prismaClient.good.findMany({
    skip: offset,
    take: limit,
  });

  return categories;
}

export async function getTotalGoods() {
  const goods = await prismaClient.good.count();

  return goods;
}
