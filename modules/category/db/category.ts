import { prismaClient } from '../../../libs/db/prisma-client';

export async function getCategoryById(id: number) {
  const category = await prismaClient.goodCategory.findUnique({
    where: {
      id: Number(id),
    },
  });

  return category;
}

export async function getCategories(offset: number, limit: number) {
  const categories = await prismaClient.goodCategory.findMany({
    skip: offset,
    take: limit,
  });

  return categories;
}

export async function getTotalCategories() {
  const categories = await prismaClient.goodCategory.count();

  return categories;
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
