import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createDeliveryMethod,
  deleteDeliveryMethodById,
  getDeliveryMethods,
  getDeliveryMethodById,
  getTotalDeliveryMethods,
  updateDeliveryMethod,
} from './db/delivery-methods';
import { BackendError } from '../../index';

export async function getDeliveryMethod(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const itemId = req.params.id;

  const item = await getDeliveryMethodById(itemId);

  if (!item) {
    throw new BackendError('Delivery method not found', 404);
  }

  reply.sendWithStatus(200, item);
}

export async function getDeliveryMethodsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const itemsList = await getDeliveryMethods(offset, limit);
  const itemsTotal = await getTotalDeliveryMethods();

  if (!itemsList) {
    throw new BackendError('Delivery methods not found', 404);
  }

  reply.sendWithPagination(200, itemsList, itemsTotal);
}

interface ICreateDeliveryMethodBody {
  title: string;
  name: string;
  image?: string;
  description: string;
}

export async function postDeliveryMethod(
  req: FastifyRequest<{ Body: ICreateDeliveryMethodBody }>,
  reply: FastifyReply
) {
  const item = await createDeliveryMethod(req.body);

  if (!item) {
    throw new BackendError('Delivery method not created', 409);
  }

  reply.sendWithStatus(200, item);
}

export async function patchDeliveryMethod(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<ICreateDeliveryMethodBody> }>,
  reply: FastifyReply
) {
  const item = await updateDeliveryMethod(req.params.id, req.body);

  if (!item) {
    throw new BackendError('Delivery method not updated', 409);
  }

  reply.sendWithStatus(200, item);
}

export async function deleteDeliveryMethod(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const item = await deleteDeliveryMethodById(req.params.id);

  if (!item) {
    throw new BackendError('Delivery method not deleted', 409);
  }

  reply.sendWithStatus(200, item);
}
