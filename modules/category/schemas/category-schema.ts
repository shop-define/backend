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

export const CreateCategorySchema: FastifySchema = {
  tags: ['Good-categories'],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(GoodCategorySchema, ['id']),
  response: {
    200: ResponseWithStatus(GoodCategorySchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateCategorySchema: FastifySchema = {
  tags: ['Good-categories'],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: Type.Integer(),
  }),
  body: Type.Partial(Type.Omit(GoodCategorySchema, ['id'])),
  response: {
    200: ResponseWithStatus(GoodCategorySchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
