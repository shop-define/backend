import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  TransactionSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

const tag = 'Transaction';

export const GetTransactionSchema: FastifySchema = {
  tags: [tag],
  response: {
    200: ResponseWithStatus(TransactionSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: TransactionSchema.properties.id,
  }),
};

export const GetTransactionsListSchema: FastifySchema = {
  tags: [tag],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(TransactionSchema)),
    404: ErrorSchema,
  },
};

export const UpdateTransactionSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: TransactionSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(TransactionSchema, ['id', 'createdAt', 'updatedAt'])),
  response: {
    200: ResponseWithStatus(TransactionSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
