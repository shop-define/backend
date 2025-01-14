import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  GoodCategorySchema,
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

export const GetGoodPrivateSchema: FastifySchema = {
  tags: ['Good'],
  security: [{ BearerAuth: [] }],
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

export const GetGoodPrivateGroup: FastifySchema = {
  tags: ['Good'],
  security: [{ BearerAuth: [] }],
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
    categoryId: Type.Optional(GoodCategorySchema.properties.id),
    search: Type.Optional(Type.String()),
    sort: Type.Optional(Type.String({ enum: ['date', 'date_ask', 'count', 'count_ask', 'price', 'price_ask'] })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(GoodSchema)),
    404: ErrorSchema,
  },
};

export const GetGoodsListPrivateSchema: FastifySchema = {
  tags: ['Good'],
  security: [{ BearerAuth: [] }],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
    search: Type.Optional(Type.String()),
    sort: Type.Optional(
      Type.String({ enum: ['date', 'date_ask', 'count', 'count_ask', 'price', 'price_ask', 'published', 'draft'] })
    ),
  }),
  response: {
    200: ResponseWithPagination(
      Type.Array(
        Type.Intersect([
          GoodSchema,
          Type.Object({
            _count: Type.Object({
              BasketItem: Type.Number(),
              FavoriteItem: Type.Number(),
            }),
            bought: Type.Integer({ minimum: 0, default: 0 }),
            delivering: Type.Integer({ minimum: 0, default: 0 }),
          }),
        ])
      )
    ),
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
