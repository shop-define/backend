import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { ResponseWithStatus } from '../../../libs/schemas/common-schema';

export const ProfileSchema: FastifySchema = {
  response: {
    200: Type.Intersect([
      ResponseWithStatus,
      Type.Object({
        data: Type.Object({
          profile: Type.Object({
            id: Type.Number(),
            email: Type.String(),
          }),
        }, {
          title: 'ProfileResponse',
        }),
      }),
    ]),
  },
};
