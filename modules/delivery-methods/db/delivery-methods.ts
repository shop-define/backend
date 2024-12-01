import { prismaClient } from '../../../libs/db/prisma-client';

export async function getDeliveryMethodById(id: string) {
  return await prismaClient.deliveryMethod.findUnique({
    where: {
      id,
    },
  });
}

export async function getDeliveryMethods(offset: number, limit: number) {
  return await prismaClient.deliveryMethod.findMany({
    skip: offset,
    take: limit,
  });
}

export async function getTotalDeliveryMethods() {
  return await prismaClient.deliveryMethod.count();
}

type DeliveryMethodBody = {
  title: string;
  description: string;
  image?: string;
};

export async function createDeliveryMethod(data: DeliveryMethodBody) {
  return await prismaClient.deliveryMethod.create({
    data,
  });
}

export async function updateDeliveryMethod(id: string, data: Partial<DeliveryMethodBody>) {
  return await prismaClient.deliveryMethod.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteDeliveryMethodById(id: string) {
  return await prismaClient.deliveryMethod.delete({
    where: {
      id,
    },
  });
}
