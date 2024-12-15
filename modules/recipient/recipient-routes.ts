import { FastifyInstance } from 'fastify';
import { getRecipient } from './recipient-controller';
import { GetRecipientSchema } from './schemas/recipient-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/recipient';
  app.register(
    async (recipientRoutes) => {
      recipientRoutes.get('/', { preHandler: [app.authenticate], schema: GetRecipientSchema }, getRecipient);
    },
    { prefix }
  );
}

export default routes;
