import { prismaClient } from '../../../libs/db/prisma-client';
import { BackendError } from '../../../index';

export async function getCheckoutById(id: string) {
  return await prismaClient.checkout.findUnique({
    where: {
      id,
    },
  });
}

function getOrder(sort: 'date' | 'date_ask' | 'recipientName' | 'recipientName_ask') {
  const orderBy = [];
  if (sort.includes('date')) {
    orderBy.push({ createdAt: sort === 'date_ask' ? 'asc' : 'desc' });
  }
  if (sort.includes('recipientName')) {
    orderBy.push({ recipientName: sort === 'recipientName_ask' ? 'asc' : 'desc' });
  }
  return orderBy as never;
}

type Queries = {
  search?: string;
  sort?: 'date' | 'date_ask' | 'recipientName' | 'recipientName_ask';
  filter?: 'created' | 'payed' | 'delivery' | 'delivered' | 'success' | 'canceled';
};

export async function getCheckouts(
  userId: number | undefined,
  offset: number,
  limit: number,
  search?: Queries['search'],
  sort?: Queries['sort'],
  filter?: Queries['filter']
) {
  return await prismaClient.checkout.findMany({
    where: {
      userId: userId,
      status: filter,
      OR: search
        ? [
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              recipientName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    },
    skip: offset,
    take: limit,
    orderBy: getOrder(sort ?? 'date'),
  });
}

export async function getTotalCheckouts(
  userId?: number,
  search?: Queries['search'],
  sort?: Queries['sort'],
  filter?: Queries['filter']
) {
  return await prismaClient.checkout.count({
    where: {
      userId: userId,
      status: filter,
      OR: search
        ? [
            {
              id: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              recipientName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    },
    orderBy: getOrder(sort ?? 'date'),
  });
}

type CheckoutBody = {
  deliveryMethodId: string;

  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;

  goodsIdList: string[];
  goodsCount: number[];
};

export async function createCheckout(userId: number, payload: CheckoutBody) {
  const deliveryMethod = await prismaClient.deliveryMethod.findUnique({
    where: { id: payload.deliveryMethodId },
  });

  const deliveryTitle = deliveryMethod?.title;
  if (deliveryTitle === null || deliveryTitle === undefined) {
    throw new BackendError('Delivery method not found', 404);
  }

  return await prismaClient.$transaction(async (prisma) => {
    const goods = await Promise.all(
      payload.goodsIdList.map((goodId: string) =>
        prisma.good.findUnique({
          where: { id: goodId },
        })
      )
    );

    if (goods.some((item) => !item)) {
      throw new BackendError('Good not found', 404);
    }

    const goodsPrices = goods.map((item) => item!.priceWithDisc || item!.price);
    const goodsNames = goods.map((item) => item!.title);

    const updatedGoods = goods.map((good, index) => {
      const remainingCount = good!.count - payload.goodsCount[index];
      const deliveringCount = good!.delivering + payload.goodsCount[index];
      if (remainingCount < 0) {
        throw new BackendError('Good count more then remainder', 400);
      }
      return {
        id: good!.id,
        count: remainingCount,
        deliveringCount,
      };
    });

    await Promise.all(
      updatedGoods.map((updatedGood) =>
        prisma.good.update({
          where: { id: updatedGood.id },
          data: { count: updatedGood.count, delivering: updatedGood.deliveringCount },
        })
      )
    );

    const { recipientName, recipientAddress, recipientPhone } = payload;

    await prisma.recipient.upsert({
      where: { userId: userId },
      update: { name: recipientName, address: recipientAddress, phone: recipientPhone },
      create: { userId, name: recipientName, address: recipientAddress, phone: recipientPhone },
    });

    return await prisma.checkout.create({
      data: {
        userId,
        ...payload,
        deliveryMethodName: deliveryTitle,
        goodsPrice: goodsPrices,
        goodsName: goodsNames,
      },
    });
  });
}

type CheckoutUpdateBody = {
  userId: number;

  paymentMethodId: string;
  paymentMethodName: string;

  deliveryMethodId: string;
  deliveryMethodName: string;

  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;

  goodsIdList: string[];
  goodsPrice: number[];
  goodsCount: number[];
  goodsName: string[];

  status: 'created' | 'payed' | 'delivery' | 'delivered' | 'success' | 'canceled';
};

export async function updateCheckout(id: string, payload: Partial<CheckoutUpdateBody>) {
  return await prismaClient.$transaction(async (prisma) => {
    const oldCheckout = await getCheckoutById(id);
    if (oldCheckout?.status === 'canceled') {
      throw new BackendError('Checkout has been canceled', 400);
    }
    if (payload.status) {
      if (oldCheckout && payload.status === 'success' && oldCheckout.status !== 'success') {
        await Promise.all(
          oldCheckout.goodsIdList.map((goodId: string, index) =>
            prisma.good.update({
              where: { id: goodId },
              data: {
                delivering: { increment: -oldCheckout.goodsCount[index] },
                bought: { increment: oldCheckout.goodsCount[index] },
              },
            })
          )
        );
      }

      if (oldCheckout && payload.status === 'canceled' && oldCheckout.status === 'success') {
        await Promise.all(
          oldCheckout.goodsIdList.map((goodId: string, index) =>
            prisma.good.update({
              where: { id: goodId },
              data: {
                count: { increment: oldCheckout.goodsCount[index] },
                bought: { decrement: oldCheckout.goodsCount[index] },
              },
            })
          )
        );
      }

      if (oldCheckout && payload.status === 'canceled' && oldCheckout.status !== 'success') {
        await Promise.all(
          oldCheckout.goodsIdList.map((goodId: string, index) =>
            prisma.good.update({
              where: { id: goodId },
              data: {
                count: { increment: oldCheckout.goodsCount[index] },
                delivering: { decrement: oldCheckout.goodsCount[index] },
              },
            })
          )
        );
      }
    }

    return await prisma.checkout.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  });
}
