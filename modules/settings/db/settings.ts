import { prismaClient } from '../../../libs/db/prisma-client';

export async function getSettingsById(id: number) {
  return await prismaClient.settings.findUnique({
    where: {
      id,
    },
  });
}

type SettingsBody = {
  title: string;
  logo: string;
};

export async function updateSettings(id: number, data: Partial<SettingsBody>) {
  return await prismaClient.settings.upsert({
    where: { id },
    update: { ...data },
    create: { title: data.title ?? '', logo: data.logo ?? '' },
  });
}
