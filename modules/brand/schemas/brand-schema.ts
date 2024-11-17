import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  BrandSchema,
  ResponseWithPagination,
  ResponseWithStatus,
} from '../../../libs/schemas/common-schema';

const tag = 'Brand';

export const GetBrandSchema: FastifySchema = {
  tags: [tag],
  response: {
    200: ResponseWithStatus(BrandSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: BrandSchema.properties.id,
  }),
};

export const GetBrandsListSchema: FastifySchema = {
  tags: [tag],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(BrandSchema)),
    404: ErrorSchema,
  },
};

export const CreateBrandSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  body: Type.Omit(BrandSchema, ['id']),
  response: {
    200: ResponseWithStatus(BrandSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateBrandSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: BrandSchema.properties.id,
  }),
  body: Type.Partial(Type.Omit(BrandSchema, ['id'])),
  response: {
    200: ResponseWithStatus(BrandSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeleteBrandSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: BrandSchema.properties.id,
  }),
  response: {
    200: ResponseWithStatus(BrandSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
