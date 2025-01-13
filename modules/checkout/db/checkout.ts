import { prismaClient } from '../../../libs/db/prisma-client';
import { BackendError } from '../../../index';

export async function getCheckoutById(id: string) {
  return await prismaClient.checkout.findUnique({
    where: {
      id,
    },
  });
}

export async function getCheckouts(userId: number | undefined, offset: number, limit: number) {
  return await prismaClient.checkout.findMany({
    where: {
      userId: userId,
    },
    skip: offset,
    take: limit,
  });
}

export async function getTotalCheckouts(userId?: number) {
  return await prismaClient.checkout.count({
    where: {
      userId: userId,
    },
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
      if (remainingCount < 0) {
        throw new BackendError('Good count more then remainder', 400);
      }
      return {
        id: good!.id,
        count: remainingCount,
      };
    });

    await Promise.all(
      updatedGoods.map((updatedGood) =>
        prisma.good.update({
          where: { id: updatedGood.id },
          data: { count: updatedGood.count },
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
  return prismaClient.checkout.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
}
