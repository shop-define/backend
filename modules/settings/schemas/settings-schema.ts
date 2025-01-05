import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { ErrorSchema, ResponseWithStatus, SettingsSchema } from '../../../libs/schemas/common-schema';

const tag = 'Settings';

export const GetSettingsSchema: FastifySchema = {
  tags: [tag],
  response: {
    200: ResponseWithStatus(SettingsSchema),
    404: ErrorSchema,
  },
};

export const UpdateSettingsSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  body: Type.Partial(SettingsSchema),
  response: {
    200: ResponseWithStatus(SettingsSchema),
    403: ErrorSchema,
    409: ErrorSchema,
  },
};
