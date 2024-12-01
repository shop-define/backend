import { prismaClient } from '../../../libs/db/prisma-client';

export async function getPaymentMethodById(id: string) {
  return await prismaClient.paymentMethod.findUnique({
    where: {
      id,
    },
  });
}

export async function getPaymentMethods(offset: number, limit: number) {
  return await prismaClient.paymentMethod.findMany({
    skip: offset,
    take: limit,
  });
}

export async function getTotalPaymentMethods() {
  return await prismaClient.paymentMethod.count();
}

type DeliveryMethodBody = {
  title: string;
  description: string;
  image?: string;
};

export async function createPaymentMethod(data: DeliveryMethodBody) {
  return await prismaClient.paymentMethod.create({
    data,
  });
}

export async function updatePaymentMethod(id: string, data: Partial<DeliveryMethodBody>) {
  return await prismaClient.paymentMethod.update({
    where: {
      id,
    },
    data,
  });
}

export async function deletePaymentMethodById(id: string) {
  return await prismaClient.paymentMethod.delete({
    where: {
      id,
    },
  });
}
