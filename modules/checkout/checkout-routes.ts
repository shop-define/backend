import { FastifyInstance } from 'fastify';
import { getCheckout, getCheckoutsList, postCheckout } from './checkout-controller';
import { CreateCheckoutSchema, GetCheckoutListSchema, GetCheckoutSchema } from './schemas/checkout-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/checkout';

  app.register(
    async (checkoutRoutes) => {
      checkoutRoutes.get(
        '/:id',
        {
          preHandler: [app.authenticate],
          schema: GetCheckoutSchema,
        },
        getCheckout
      );
      checkoutRoutes.get(
        '/',
        {
          preHandler: [app.authenticate],
          schema: GetCheckoutListSchema,
        },
        getCheckoutsList
      );
      checkoutRoutes.post(
        '/',
        {
          preHandler: [app.authenticate],
          schema: CreateCheckoutSchema,
        },
        postCheckout
      );
    },
    { prefix }
  );
}

export default routes;
