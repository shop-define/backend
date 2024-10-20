import { FastifyInstance } from 'fastify';
import { loginEmail, loginEmailValidateCode, refreshAccessToken } from './auth-controller';
import {ILoginBodySchema, ILoginConfirmBodySchema, RefreshTokenSchema} from './schemas/auth-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/auth';

  app.register(
    async (route) => {
      route.post('/refresh-token', { schema: RefreshTokenSchema}, refreshAccessToken);
      route.post('/login', { schema: ILoginBodySchema }, loginEmail);
      route.post('/confirm', { schema: ILoginConfirmBodySchema }, loginEmailValidateCode);
    },
    { prefix }
  );
}

export default routes;
