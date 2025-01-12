import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  CheckoutSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

export const GetCheckoutSchema: FastifySchema = {
  tags: ['Checkout'],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(CheckoutSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: CheckoutSchema.properties.id,
  }),
};

export const GetCheckoutListSchema: FastifySchema = {
  tags: ['Checkout'],
  security: [{ BearerAuth: [] }],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(CheckoutSchema)),
    404: ErrorSchema,
  },
};

export const CreateCheckoutSchema: FastifySchema = {
  tags: ['Checkout'],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(CheckoutSchema, [
    'id',
    'userId',
    'deliveryMethodName',
    'paymentMethodId',
    'paymentMethodName',
    'goodsPrice',
    'goodsName',
    'paymentTotal',
    'status',
    'createdAt',
    'updatedAt',
  ]),
  response: {
    200: ResponseWithStatus(CheckoutSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateCheckoutSchema: FastifySchema = {
  tags: ['Checkout'],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: CheckoutSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(CheckoutSchema, ['id', 'createdAt', 'updatedAt', 'userId', 'paymentTotal'])),
  response: {
    200: ResponseWithStatus(CheckoutSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
