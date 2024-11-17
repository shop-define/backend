import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  BasketSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

const tag = 'Basket';

export const GetBasketSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(BasketSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    goodId: BasketSchema.properties.goodId,
  }),
};

export const GetBasketListSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(BasketSchema)),
    404: ErrorSchema,
  },
};

export const CreateBasketSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  body: Type.Object({
    count: Type.Integer({ minimum: 1 }),
  }),
  response: {
    200: ResponseWithStatus(BasketSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
  params: Type.Object({
    goodId: BasketSchema.properties.goodId,
  }),
};

export const DeleteBasketSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    goodId: BasketSchema.properties.goodId,
  }),
  response: {
    200: ResponseWithStatus(BasketSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
