import { prismaClient } from '../../../libs/db/prisma-client';

export async function getFavoriteByGoodId(goodId: string, userId: number) {
  const favorite = await prismaClient.favoriteItem.findUnique({
    where: {
      userId_goodId: {
        goodId,
        userId,
      },
    },
  });

  return favorite;
}

export async function getFavorites(offset: number, limit: number, userId: number) {
  const favorites = await prismaClient.favoriteItem.findMany({
    where: {
      userId,
    },
    skip: offset,
    take: limit,
  });

  return favorites;
}

export async function getTotalFavorites(userId: number) {
  const favorites = await prismaClient.favoriteItem.count({
    where: {
      userId,
    },
  });

  return favorites;
}

export async function createFavorite(goodId: string, userId: number) {
  const favorite = await prismaClient.favoriteItem.create({
    data: {
      goodId,
      userId,
    },
  });

  return favorite;
}

export async function deleteFavoriteByGoodId(goodId: string, userId: number) {
  const favorite = await prismaClient.favoriteItem.delete({
    where: {
      userId_goodId: {
        goodId,
        userId,
      },
    },
  });

  return favorite;
}
