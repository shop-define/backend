import { FastifySchema } from 'fastify';

export const ProfileSchema: FastifySchema = {
  response: {
    200: {
      title: 'ProfileResponse',
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
          },
        }
      },
    },
  },
};
