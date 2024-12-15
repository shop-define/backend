import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  GoodSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

export const GetGoodSchema: FastifySchema = {
  tags: ['Good'],
  response: {
    200: ResponseWithStatus(GoodSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
};

export const GetGoodGroup: FastifySchema = {
  tags: ['Good'],
  response: {
    200: ResponseWithStatus(Type.Array(GoodSchema)),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
};

export const GetGoodsListSchema: FastifySchema = {
  tags: ['Good'],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(GoodSchema)),
    404: ErrorSchema,
  },
};

export const CreateGoodSchema: FastifySchema = {
  tags: ['Good'],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(GoodSchema, ['id']),
  response: {
    200: ResponseWithStatus(GoodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateGoodSchema: FastifySchema = {
  tags: ['Good'],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(GoodSchema, ['id'])),
  response: {
    200: ResponseWithStatus(GoodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeleteGoodSchema: FastifySchema = {
  tags: ['Good'],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: GoodSchema.properties.id,
  }),
  response: {
    200: ResponseWithStatus(GoodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
