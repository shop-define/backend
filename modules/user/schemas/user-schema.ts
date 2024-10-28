import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { ResponseWithStatus, UserSchema } from '../../../libs/schemas/common-schema';

export const ProfileSchema: FastifySchema = {
  tags: ['Me'],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(
      Type.Object({
        profile: UserSchema,
      })
    ),
  },
};
