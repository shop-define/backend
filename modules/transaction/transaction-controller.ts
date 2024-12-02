import { FastifyReply, FastifyRequest } from 'fastify';
import { getTransactions, getTransactionById, getTotalTransactions, updateTransaction } from './db/transaction';
import { BackendError } from '../../index';

export async function getTransaction(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const itemId = req.params.id;

  const item = await getTransactionById(itemId);

  if (!item) {
    throw new BackendError('Transaction not found', 404);
  }

  reply.sendWithStatus(200, item);
}

export async function getTransactionsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const itemsList = await getTransactions(offset, limit);
  const itemsTotal = await getTotalTransactions();

  if (!itemsList) {
    throw new BackendError('Transactions not found', 404);
  }

  reply.sendWithPagination(200, itemsList, itemsTotal);
}

interface IPatchTransactionBody {
  status: 'pending' | 'success' | 'error';
  amount: number;
  checkoutId: string;
  providerData: string;
}

export async function patchTransaction(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<IPatchTransactionBody> }>,
  reply: FastifyReply
) {
  const item = await updateTransaction(req.params.id, req.body);

  if (!item) {
    throw new BackendError('Transaction not updated', 409);
  }

  reply.sendWithStatus(200, item);
}
