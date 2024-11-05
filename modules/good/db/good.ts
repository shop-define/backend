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

type GoodBody = {
  title: string;
  description: string;
  price: number;
  count: number;
  categoryId: number | null;
  brandId: string | null;
};

export async function createGood(payload: GoodBody) {
  const good = await prismaClient.good.create({
    data: payload,
  });

  return good;
}

export async function updateGood(id: string, payload: Partial<GoodBody>) {
  const good = await prismaClient.good.update({
    where: {
      id,
    },
    data: payload,
  });

  return good;
}

export async function deleteGoodById(id: string) {
  const good = await prismaClient.good.delete({
    where: {
      id,
    },
  });

  return good;
}
