import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  DeliveryMethodSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

const tag = 'Delivery-methods';

export const GetDeliveryMethodSchema: FastifySchema = {
  tags: [tag],
  response: {
    200: ResponseWithStatus(DeliveryMethodSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: DeliveryMethodSchema.properties.id,
  }),
};

export const GetDeliveryMethodsListSchema: FastifySchema = {
  tags: [tag],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(DeliveryMethodSchema)),
    404: ErrorSchema,
  },
};

export const CreateDeliveryMethodSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(DeliveryMethodSchema, ['id']),
  response: {
    200: ResponseWithStatus(DeliveryMethodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateDeliveryMethodSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: DeliveryMethodSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(DeliveryMethodSchema, ['id'])),
  response: {
    200: ResponseWithStatus(DeliveryMethodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeleteDeliveryMethodSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: DeliveryMethodSchema.properties.id,
  }),
  response: {
    200: ResponseWithStatus(DeliveryMethodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
