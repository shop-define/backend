import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  GoodCategorySchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

export const GetCategorySchema: FastifySchema = {
  tags: ['Good-categories'],
  response: {
    200: ResponseWithStatus(GoodCategorySchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: Type.Integer(),
  }),
};

export const GetCategoriesListSchema: FastifySchema = {
  tags: ['Good-categories'],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(GoodCategorySchema)),
    404: ErrorSchema,
  },
};
