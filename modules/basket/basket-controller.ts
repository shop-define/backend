import { FastifyReply, FastifyRequest } from 'fastify';
import { getBasket, getBasketByGoodId, getTotalBasketItems, createBasket, deleteBasketByGoodId } from './db/basket';
import { BackendError } from '../../index';

export async function GetBasket(req: FastifyRequest<{ Params: { goodId: string } }>, reply: FastifyReply) {
  const {
    userId,
    params: { goodId },
  } = req;

  const basket = await getBasketByGoodId(goodId, userId as number);

  if (!basket) {
    throw new BackendError('Basket item not found', 404);
  }

  reply.sendWithStatus(200, basket);
}

export async function getBasketList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;
  const { userId } = req;

  const basketList = await getBasket(offset, limit, userId as number);
  const basketTotal = await getTotalBasketItems(userId as number);

  if (!basketList) {
    throw new BackendError('Basket not found', 404);
  }

  reply.sendWithPagination(200, basketList, basketTotal);
}

export async function postBasket(
  req: FastifyRequest<{ Params: { goodId: string }; Body: { count: number } }>,
  reply: FastifyReply
) {
  const {
    userId,
    params: { goodId },
    body: { count },
  } = req;

  const basket = await createBasket(goodId, count, userId as number);

  if (!basket) {
    throw new BackendError('Basket not created', 409);
  }

  reply.sendWithStatus(200, basket);
}

export async function deleteBasket(req: FastifyRequest<{ Params: { goodId: string } }>, reply: FastifyReply) {
  const {
    userId,
    params: { goodId },
  } = req;

  const basket = await deleteBasketByGoodId(goodId, userId as number);

  if (!basket) {
    throw new BackendError('Basket not deleted', 409);
  }

  reply.sendWithStatus(200, basket);
}
