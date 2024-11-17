import { FastifyReply, FastifyRequest } from 'fastify';
import { createBrand, deleteBrandById, getBrands, getBrandById, getTotalBrands, updateBrand } from './db/brand';
import { BackendError } from '../../index';

export async function getBrand(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const brandId = req.params.id;

  const category = await getBrandById(brandId);

  if (!category) {
    throw new BackendError('Brand not found', 404);
  }

  reply.sendWithStatus(200, category);
}

export async function getBrandsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  const { offset = 0, limit = 10 } = req.query;

  const brandsList = await getBrands(offset, limit);
  const brandsTotal = await getTotalBrands();

  if (!brandsList) {
    throw new BackendError('Brands not found', 404);
  }

  reply.sendWithPagination(200, brandsList, brandsTotal);
}

interface ICreateBrandBody {
  title: string;
  name: string;
  description: string;
}

export async function postBrand(req: FastifyRequest<{ Body: ICreateBrandBody }>, reply: FastifyReply) {
  const brand = await createBrand(req.body);

  if (!brand) {
    throw new BackendError('Brand not created', 409);
  }

  reply.sendWithStatus(200, brand);
}

export async function patchBrand(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<ICreateBrandBody> }>,
  reply: FastifyReply
) {
  const brand = await updateBrand(req.params.id, req.body);

  if (!brand) {
    throw new BackendError('Brand not updated', 409);
  }

  reply.sendWithStatus(200, brand);
}

export async function deleteBrand(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const brand = await deleteBrandById(req.params.id);

  if (!brand) {
    throw new BackendError('Brand not deleted', 409);
  }

  reply.sendWithStatus(200, brand);
}
