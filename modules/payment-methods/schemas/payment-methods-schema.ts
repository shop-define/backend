import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  PaymentMethodSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

const tag = 'Payment-methods';

export const GetPaymentMethodSchema: FastifySchema = {
  tags: [tag],
  response: {
    200: ResponseWithStatus(PaymentMethodSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: PaymentMethodSchema.properties.id,
  }),
};

export const GetPaymentMethodsListSchema: FastifySchema = {
  tags: [tag],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(PaymentMethodSchema)),
    404: ErrorSchema,
  },
};

export const CreatePaymentMethodSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(PaymentMethodSchema, ['id']),
  response: {
    200: ResponseWithStatus(PaymentMethodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdatePaymentMethodSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: PaymentMethodSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(PaymentMethodSchema, ['id'])),
  response: {
    200: ResponseWithStatus(PaymentMethodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeletePaymentMethodSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: PaymentMethodSchema.properties.id,
  }),
  response: {
    200: ResponseWithStatus(PaymentMethodSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
