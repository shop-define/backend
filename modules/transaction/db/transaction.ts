import { prismaClient } from '../../../libs/db/prisma-client';

export async function getTransactionById(id: string) {
  return await prismaClient.transaction.findUnique({
    where: {
      id,
    },
  });
}

export async function getTransactions(offset: number, limit: number) {
  return await prismaClient.transaction.findMany({
    skip: offset,
    take: limit,
  });
}

export async function getTotalTransactions() {
  return await prismaClient.transaction.count();
}

type TransactionBody = {
  status: 'pending' | 'success' | 'error';
  amount: number;
  checkoutId: string;
  providerData: string;
};

export async function updateTransaction(id: string, data: Partial<TransactionBody>) {
  return await prismaClient.transaction.update({
    where: {
      id,
    },
    data,
  });
}
