import { prismaClient } from '../../../libs/db/prisma-client';

export async function getCategoryById(id: number) {
  return prismaClient.goodCategory.findUnique({
    where: {
      id: Number(id),
    },
  });
}

export async function getCategories() {
  return prismaClient.goodCategory.findMany();
}

export async function getTotalCategories() {
  return prismaClient.goodCategory.count();
}

type CategoryBody = {
  title: string;
  description: string;
  image?: string;
  parentId: number | null;
};

export async function createCategory(data: CategoryBody) {
  const category = await prismaClient.goodCategory.create({
    data,
  });

  return category;
}

export async function updateCategory(id: number, data: Partial<CategoryBody>) {
  const category = await prismaClient.goodCategory.update({
    where: {
      id,
    },
    data,
  });

  return category;
}

export async function deleteCategoryById(id: number) {
  const category = await prismaClient.goodCategory.delete({
    where: {
      id,
    },
  });

  return category;
}
