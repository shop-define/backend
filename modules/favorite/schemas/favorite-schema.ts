import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  FavoriteSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

const tag = 'Good-favorites';

export const CheckFavoriteSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(Type.Boolean()),
    404: ErrorSchema,
  },
  params: Type.Object({
    goodId: FavoriteSchema.properties.goodId,
  }),
};

export const GetFavoritesListSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(FavoriteSchema.properties.goodId)),
    404: ErrorSchema,
  },
};

export const CreateFavoriteSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(Type.Boolean()),
    403: ErrorSchema,
    409: ErrorSchema,
  },
  params: Type.Object({
    goodId: FavoriteSchema.properties.goodId,
  }),
};

export const DeleteFavoriteSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    goodId: FavoriteSchema.properties.goodId,
  }),
  response: {
    200: ResponseWithStatus(Type.Boolean()),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
