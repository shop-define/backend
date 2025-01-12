import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCategory,
  deleteCategoryById,
  getCategories,
  getCategoryById,
  getTotalCategories,
  updateCategory,
} from './db/category';
import { BackendError } from '../../index';

export async function getCategory(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
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
  const categoriesList = await getCategories();
  const categoriesTotal = await getTotalCategories();

  if (!categoriesList) {
    throw new BackendError('Categories not found', 404);
  }

  reply.sendWithPagination(200, categoriesList, categoriesTotal);
}

interface ICreateCategoryBody {
  title: string;
  description: string;
  image?: string;
  parentId: number | null;
}

export async function postCategory(req: FastifyRequest<{ Body: ICreateCategoryBody }>, reply: FastifyReply) {
  const category = await createCategory(req.body);

  if (!category) {
    throw new BackendError('Category not created', 409);
  }

  reply.sendWithStatus(200, category);
}

export async function patchCategory(
  req: FastifyRequest<{ Params: { id: number }; Body: Partial<ICreateCategoryBody> }>,
  reply: FastifyReply
) {
  const category = await updateCategory(req.params.id, req.body);

  if (!category) {
    throw new BackendError('Category not updated', 409);
  }

  reply.sendWithStatus(200, category);
}

export async function deleteCategory(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
  const category = await deleteCategoryById(req.params.id);

  if (!category) {
    throw new BackendError('Category not deleted', 409);
  }

  reply.sendWithStatus(200, category);
}
