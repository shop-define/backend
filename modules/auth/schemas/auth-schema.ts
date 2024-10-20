import { FastifySchema } from 'fastify';

export const ILoginConfirmBodySchema: FastifySchema = {
  body: {
    title: 'ILoginConfirmBody',
    type: 'object',
    properties: {
      email: { type: 'string' },
      code: { type: 'string' },
    },
    required: ['email', 'code'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
          },
        },
        accessToken: {
          type: 'string',
        },
      },
    },
  },
};

export const ILoginBodySchema: FastifySchema = {
  body: {
    title: 'ILoginBody',
    type: 'object',
    properties: {
      email: { type: 'string' },
    },
    required: ['email'],
  },
  response: {
    200: {
      type: 'string',
      enum: ["ok"]
    },
  },
};

export const RefreshTokenSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  },
};
