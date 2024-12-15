import { FastifySchema } from 'fastify';
import { ErrorSchema, RecipientSchema, ResponseWithStatus } from '../../../libs/schemas/common-schema';

const tag = 'Recipient';

export const GetRecipientSchema: FastifySchema = {
  tags: [tag],
  security: [{ BearerAuth: [] }],
  response: {
    200: ResponseWithStatus(RecipientSchema),
    404: ErrorSchema,
  },
};
