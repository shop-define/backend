import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getFavorites,
  getFavoriteByGoodId,
  getTotalFavorites,
  createFavorite,
  deleteFavoriteByGoodId,
} from './db/favorite';
import { BackendError } from '../../index';

export async function checkFavoriteGood(req: FastifyRequest<{ Params: { goodId: string } }>, reply: FastifyReply) {
  const {
    userId,
    params: { goodId },
  } = req;

  const favorite = await getFavoriteByGoodId(goodId, userId as number);

  if (!favorite) {
    throw new BackendError('Favorite not found', 404);
  }

  reply.sendWithStatus(200, !!favorite);
}

export async function getFavoritesList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;
  const { userId } = req;

  const favoritesList = await getFavorites(offset, limit, userId as number);
  const preparedFavoritesList = favoritesList.map((item) => item.goodId);
  const favoritesTotal = await getTotalFavorites(userId as number);

  if (!favoritesList) {
    throw new BackendError('Favorite not found', 404);
  }

  reply.sendWithPagination(200, preparedFavoritesList, favoritesTotal);
}

export async function postFavorite(req: FastifyRequest<{ Params: { goodId: string } }>, reply: FastifyReply) {
  const {
    userId,
    params: { goodId },
  } = req;

  const favorite = await createFavorite(goodId, userId as number);

  if (!favorite) {
    throw new BackendError('Favorite not created', 409);
  }

  reply.sendWithStatus(200, true);
}

export async function deleteFavorite(req: FastifyRequest<{ Params: { goodId: string } }>, reply: FastifyReply) {
  const {
    userId,
    params: { goodId },
  } = req;

  const favorite = await deleteFavoriteByGoodId(goodId, userId as number);

  if (!favorite) {
    throw new BackendError('Favorite not deleted', 409);
  }

  reply.sendWithStatus(200, true);
}
