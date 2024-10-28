import { FastifyReply, FastifyRequest } from 'fastify';
import { getCategoryById } from './db/category';
import {BackendError} from "../../index";

export async function getCategory(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) {
  const categoryId = req.params.id

  const category = await getCategoryById(Number(categoryId));

  if (!category) {
    throw new BackendError('Category not found', 404);
  }

  reply.sendWithStatus(200, category);
}
