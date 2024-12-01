import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createPaymentMethod,
  deletePaymentMethodById,
  getPaymentMethods,
  getPaymentMethodById,
  getTotalPaymentMethods,
  updatePaymentMethod,
} from './db/payment-methods';
import { BackendError } from '../../index';

export async function getPaymentMethod(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const itemId = req.params.id;

  const item = await getPaymentMethodById(itemId);

  if (!item) {
    throw new BackendError('Payment method not found', 404);
  }

  reply.sendWithStatus(200, item);
}

export async function getPaymentMethodsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const itemsList = await getPaymentMethods(offset, limit);
  const itemsTotal = await getTotalPaymentMethods();

  if (!itemsList) {
    throw new BackendError('Payment methods not found', 404);
  }

  reply.sendWithPagination(200, itemsList, itemsTotal);
}

interface ICreateDeliveryMethodBody {
  title: string;
  name: string;
  image?: string;
  description: string;
}

export async function postPaymentMethod(req: FastifyRequest<{ Body: ICreateDeliveryMethodBody }>, reply: FastifyReply) {
  const item = await createPaymentMethod(req.body);

  if (!item) {
    throw new BackendError('Payment method not created', 409);
  }

  reply.sendWithStatus(200, item);
}

export async function patchPaymentMethod(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<ICreateDeliveryMethodBody> }>,
  reply: FastifyReply
) {
  const item = await updatePaymentMethod(req.params.id, req.body);

  if (!item) {
    throw new BackendError('Payment method not updated', 409);
  }

  reply.sendWithStatus(200, item);
}

export async function deletePaymentMethod(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const item = await deletePaymentMethodById(req.params.id);

  if (!item) {
    throw new BackendError('Payment method not deleted', 409);
  }

  reply.sendWithStatus(200, item);
}
