import { FastifyReply, FastifyRequest } from 'fastify';
import { getGoods, getGoodById, getTotalGoods } from './db/good';
import { BackendError } from '../../index';

export async function getGood(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const goodId = req.params.id;

  const good = await getGoodById(goodId);

  if (!good) {
    throw new BackendError('Good not found', 404);
  }

  reply.sendWithStatus(200, good);
}

export async function getGoodsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const goodsList = await getGoods(offset, limit);
  const goodsTotal = await getTotalGoods();

  if (!goodsList) {
    throw new BackendError('Goods not found', 404);
  }

  reply.sendWithPagination(200, goodsList, goodsTotal);
}
