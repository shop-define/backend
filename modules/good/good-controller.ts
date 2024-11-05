import { FastifyReply, FastifyRequest } from 'fastify';
import { getGoods, getGoodById, getTotalGoods, createGood, updateGood, deleteGoodById } from './db/good';
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

interface ICreateGoodBody {
  title: string;
  description: string;
  price: number;
  categoryId: number | null;
  brandId: string | null;
}

export async function postGood(req: FastifyRequest<{ Body: ICreateGoodBody }>, reply: FastifyReply) {
  const good = await createGood(req.body);

  if (!good) {
    throw new BackendError('Good not created', 409);
  }

  reply.sendWithStatus(200, good);
}

export async function patchGood(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<ICreateGoodBody> }>,
  reply: FastifyReply
) {
  const good = await updateGood(req.params.id, req.body);

  if (!good) {
    throw new BackendError('Good not updated', 409);
  }

  reply.sendWithStatus(200, good);
}

export async function deleteGood(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const good = await deleteGoodById(req.params.id);

  if (!good) {
    throw new BackendError('Good not deleted', 409);
  }

  reply.sendWithStatus(200, good);
}
