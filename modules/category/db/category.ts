import { prismaClient } from '../../../libs/db/prisma-client';

export async function getCategoryById(id: number) {
  const category = await prismaClient.goodCategory.findUnique({
      where: {
        id: Number(id),
      },
    }
  )

  return category;
}

export async function createCategory({ email }: { email?: string }) {
  const category = await prismaClient.goodCategory.create({
    data: {
      title: 'Название категории',
      description: 'Описание категории',
      parentId: null,
    },
  });

  return category;
}
