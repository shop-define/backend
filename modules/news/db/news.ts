import { prismaClient } from '../../../libs/db/prisma-client';

export async function getNewsById(id: string, filter?: 'published') {
  return await prismaClient.news.findUnique({
    where: {
      id,
      status: filter,
    },
  });
}

export async function getNewsD(offset: number, limit: number, filter?: 'published') {
  return await prismaClient.news.findMany({
    skip: offset,
    take: limit,
    where: {
      status: filter,
    },
    orderBy: [{ isPrimary: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getTotalNews(filter?: 'published') {
  return await prismaClient.news.count({
    where: {
      status: filter,
    },
  });
}

type NewsBody = {
  title: string;
  images: string[];
  htmlDocumentName: string;
  status: 'draft' | 'published';
  isPrimary: boolean;
};

export async function createNews({ title, images, htmlDocumentName, status, isPrimary }: NewsBody) {
  let publishedAt;

  if (status === 'published') {
    publishedAt = new Date();
  }

  return await prismaClient.news.create({
    data: {
      title,
      images,
      htmlDocumentName,
      status,
      isPrimary,
      publishedAt,
    },
  });
}

export async function updateNews(
  id: string,
  { title, images, htmlDocumentName, status, isPrimary }: Partial<NewsBody>
) {
  let publishedAt;

  if (status === 'published') {
    publishedAt = new Date();
  }

  return await prismaClient.news.update({
    where: {
      id,
    },
    data: {
      title,
      images,
      htmlDocumentName,
      status,
      isPrimary,
      publishedAt,
    },
  });
}

export async function deleteNewsById(id: string) {
  return await prismaClient.news.delete({
    where: {
      id,
    },
  });
}
