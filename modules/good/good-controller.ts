import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getGoods,
  getGoodById,
  getTotalGoods,
  createGood,
  updateGood,
  deleteGoodById,
  getGoodsByGroup,
} from './db/good';
import { BackendError } from '../../index';

async function getGood(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply, filter?: 'published') {
  const goodId = req.params.id;

  const good = await getGoodById(goodId, filter);

  if (!good) {
    throw new BackendError('Good not found', 404);
  }

  reply.sendWithStatus(200, good);
}

export async function getGoodPublic(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getGood(req, reply, 'published');
}

export async function getGoodPrivate(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getGood(req, reply);
}

async function getGoodGroup(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
  filter?: 'published'
) {
  const goodId = req.params.id;

  const good = await getGoodById(goodId, filter);

  if (!good) {
    throw new BackendError('Goods not found', 404);
  }

  if (good.articleNumber === null) {
    reply.sendWithStatus(200, [good]);
    return;
  }

  const goods = await getGoodsByGroup(good.articleNumber, filter);

  reply.sendWithStatus(200, goods);
}

export async function getGoodGroupPublic(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getGoodGroup(req, reply, 'published');
}

export async function getGoodGroupPrivate(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getGoodGroup(req, reply);
}

interface GoodsListQuery {
  offset?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  sort?: 'date_ask' | 'date' | 'count_ask' | 'count' | 'price_ask' | 'price' | 'published' | 'draft';
}

async function getGoodsList(
  req: FastifyRequest<{ Querystring: GoodsListQuery }>,
  reply: FastifyReply,
  filter?: 'published'
) {
  const { offset = 0, limit = 10, search, sort, categoryId } = req.query;

  const goodsList = await getGoods(offset, limit, sort, search, filter, categoryId);
  const goodsTotal = await getTotalGoods(search, filter, categoryId);

  if (!goodsList) {
    throw new BackendError('Goods not found', 404);
  }

  reply.sendWithPagination(200, goodsList, goodsTotal);
}

export function getGoodsListPublic(
  req: FastifyRequest<{
    Querystring: {
      offset?: number;
      limit?: number;
      categoryId?: number;
      search?: string;
      sort?: 'date_ask' | 'date' | 'count_ask' | 'count' | 'price_ask' | 'price';
    };
  }>,
  reply: FastifyReply
) {
  return getGoodsList(req, reply, 'published');
}

export function getGoodsListPrivate(
  req: FastifyRequest<{
    Querystring: {
      offset?: number;
      limit?: number;
      categoryId?: number;
      search?: string;
      sort?: 'date_ask' | 'date' | 'count_ask' | 'count' | 'price_ask' | 'price' | 'published' | 'draft';
    };
  }>,
  reply: FastifyReply
) {
  return getGoodsList(req, reply);
}

interface ICreateGoodBody {
  title: string;
  description: string;
  price: number;
  count: number;
  images: string[];
  categoryId: number | null;
  brandId: string | null;
  articleNumber: string | null;
  modifiedName: string | null;
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
