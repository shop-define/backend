import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { ErrorSchema, ResponseWithStatus, ImageSchema } from '../../../libs/schemas/common-schema';

const tag = 'Images';

export const UploadImageSchema: FastifySchema = {
  tags: [tag],
  consumes: ['multipart/form-data'],
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    required: ['image'],
    properties: {
      image: Type.Union([Type.String({ format: 'binary' }), Type.Any({ format: 'binary' })], { format: 'binary' }),
    },
  },
  response: {
    200: ResponseWithStatus(ImageSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};

export const DeleteImageSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  params: Type.Pick(ImageSchema, ['name']),
  response: {
    200: ResponseWithStatus(ImageSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
