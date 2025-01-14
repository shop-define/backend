import { prismaClient } from '../../../libs/db/prisma-client';

export async function getGoodById(id: string, filter?: 'published') {
  const good = await prismaClient.good.findUnique({
    where: {
      id,
      status: filter,
    },
  });

  return good;
}

export async function getGoodsByGroup(group: string, filter?: 'published') {
  return await prismaClient.good.findMany({
    where: {
      articleNumber: group,
      status: filter,
    },
  });
}

function getOrder(
  sort: 'date_ask' | 'date' | 'count_ask' | 'count' | 'price_ask' | 'price' | 'published' | 'draft' = 'date'
) {
  const orderBy = [];
  if (sort.includes('date')) {
    orderBy.push({ createdAt: sort === 'date_ask' ? 'asc' : 'desc' });
  }
  if (sort.includes('count')) {
    orderBy.push({ createdAt: sort === 'count_ask' ? 'asc' : 'desc' });
  }
  if (sort.includes('price')) {
    orderBy.push({ price: sort === 'price_ask' ? 'asc' : 'desc' });
  }
  if (sort.includes('published') || sort.includes('draft')) {
    orderBy.push({ status: sort === 'published' ? 'desc' : 'asc' });
  }
  return orderBy as never;
}

export async function getGoods(
  offset: number,
  limit: number,
  sort: 'date_ask' | 'date' | 'count_ask' | 'count' | 'price_ask' | 'price' | 'published' | 'draft' = 'date',
  search?: string,
  filter?: 'published',
  categoryId?: number
) {
  return await prismaClient.good.findMany({
    skip: offset,
    take: limit,
    where: {
      categoryId: categoryId,
      status: filter,
      OR: search
        ? [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    },
    orderBy: getOrder(sort),
    include: {
      _count: {
        select: {
          BasketItem: true,
          FavoriteItem: true,
        },
      },
    },
  });
}

export async function getTotalGoods(search?: string, filter?: 'published', categoryId?: number) {
  return prismaClient.good.count({
    where: {
      categoryId,
      status: filter,
      OR: search
        ? [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    },
  });
}

type GoodBody = {
  title: string;
  description: string;
  price: number;
  count: number;
  images: string[];
  categoryId: number | null;
  brandId: string | null;
  articleNumber: string | null;
  modifiedName: string | null;
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
