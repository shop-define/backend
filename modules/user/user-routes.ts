import { FastifyInstance } from 'fastify';
import { getUser } from './user-controller';
import { ProfileSchema } from './schemas/user-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/me';
  app.register(
    async (userRoutes) => {
      userRoutes.get('/profile', { preHandler: [app.authenticate], schema: ProfileSchema }, getUser);
    },
    { prefix }
  );
}

export default routes;
