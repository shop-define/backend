import { FastifyReply, FastifyRequest } from 'fastify';
import { getCategories, getCategoryById, getTotalCategories } from './db/category';
import { BackendError } from '../../index';

export async function getCategory(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const categoryId = req.params.id;

  const category = await getCategoryById(Number(categoryId));

  if (!category) {
    throw new BackendError('Category not found', 404);
  }

  reply.sendWithStatus(200, category);
}

export async function getCategoriesList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const categoriesList = await getCategories(offset, limit);
  const categoriesTotal = await getTotalCategories();

  if (!categoriesList) {
    throw new BackendError('Categories not found', 404);
  }

  reply.sendWithPagination(200, categoriesList, categoriesTotal);
}
