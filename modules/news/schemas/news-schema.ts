import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {
  ErrorSchema,
  ResponseWithPagination,
  ResponseWithStatus,
  NewsSchema,
} from '../../../libs/schemas/common-schema';

const tag = 'News';

export const GetNewsSchema: FastifySchema = {
  tags: [tag],
  response: {
    200: ResponseWithStatus(NewsSchema),
    404: ErrorSchema,
  },
  params: Type.Object({
    id: NewsSchema.properties.id,
  }),
};

const PreviewNews = Type.Omit(NewsSchema, ['htmlContent']);

export const GetNewsListSchema: FastifySchema = {
  tags: [tag],
  querystring: Type.Object({
    limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Integer({ minimum: 0 })),
  }),
  response: {
    200: ResponseWithPagination(Type.Array(PreviewNews)),
    404: ErrorSchema,
  },
};

export const GetNewsSchemaPrivate = {
  ...GetNewsSchema,
  security: [{ BearerAuth: [] }],
};

export const GetNewsListSchemaPrivate = {
  ...GetNewsListSchema,
  security: [{ BearerAuth: [] }],
};

const NewsBodyCreate = Type.Omit(NewsSchema, ['id', 'publishedAt', 'createdAt', 'updatedAt']);

export const CreateNewsSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  body: NewsBodyCreate,
  response: {
    200: ResponseWithStatus(NewsSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const UpdateNewsSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: NewsSchema.properties.id,
  }),
  body: Type.Partial(NewsBodyCreate),
  response: {
    200: ResponseWithStatus(NewsSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeleteNewsSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Object({
    id: NewsSchema.properties.id,
  }),
  response: {
    200: ResponseWithStatus(PreviewNews),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
