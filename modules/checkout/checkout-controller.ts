import { FastifyReply, FastifyRequest } from 'fastify';
import { getCheckouts, getCheckoutById, getTotalCheckouts, createCheckout } from './db/checkout';
import { BackendError } from '../../index';

export async function getCheckout(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const checkoutId = req.params.id;

  const checkout = await getCheckoutById(checkoutId);

  if (!checkout) {
    throw new BackendError('Checkout not found', 404);
  }

  if (checkout.userId !== req.userId) {
    throw new BackendError('Checkout not permitted', 403);
  }

  reply.sendWithStatus(200, checkout);
}

export async function getCheckoutsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const checkoutsList = await getCheckouts(req.userId as number, offset, limit);
  const checkoutsTotal = await getTotalCheckouts(req.userId as number);

  if (!checkoutsList) {
    throw new BackendError('Checkouts not found', 404);
  }

  reply.sendWithPagination(200, checkoutsList, checkoutsTotal);
}

interface ICreateCheckoutBody {
  deliveryMethodId: string;

  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;

  goodsIdList: string[];
  goodsCount: number[];
}

export async function postCheckout(req: FastifyRequest<{ Body: ICreateCheckoutBody }>, reply: FastifyReply) {
  if (req.body.goodsIdList.length !== req.body.goodsCount.length || req.body.goodsIdList.length <= 0) {
    throw new BackendError('Goods count not correct', 400);
  }

  const checkout = await createCheckout(req.userId as number, req.body);

  if (!checkout) {
    throw new BackendError('Checkout not created', 409);
  }

  reply.sendWithStatus(200, checkout);
}
