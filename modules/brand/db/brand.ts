import { prismaClient } from '../../../libs/db/prisma-client';

export async function getBrandById(id: string) {
  return await prismaClient.brand.findUnique({
    where: {
      id,
    },
  });
}

export async function getBrands(offset: number, limit: number) {
  return await prismaClient.brand.findMany({
    skip: offset,
    take: limit,
  });
}

export async function getTotalBrands() {
  return await prismaClient.brand.count();
}

type BrandBody = {
  title: string;
  name: string;
  description: string;
};

export async function createBrand(data: BrandBody) {
  return await prismaClient.brand.create({
    data,
  });
}

export async function updateBrand(id: string, data: Partial<BrandBody>) {
  return await prismaClient.brand.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteBrandById(id: string) {
  return await prismaClient.brand.delete({
    where: {
      id,
    },
  });
}
