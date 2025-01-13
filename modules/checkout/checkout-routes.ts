import { FastifyInstance } from 'fastify';
import {
  getCheckout,
  getCheckoutPrivate,
  getCheckoutsList,
  getCheckoutsListPrivate,
  patchCheckout,
  postCheckout,
} from './checkout-controller';
import {
  CreateCheckoutSchema,
  GetCheckoutListPrivateSchema,
  GetCheckoutListSchema,
  GetCheckoutSchema,
  UpdateCheckoutSchema,
} from './schemas/checkout-schema';
import { routesAccess } from '../../config/routes-access';
import { config } from '../../config';

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

  app.register(
    async (checkoutRoutesPrivate) => {
      checkoutRoutesPrivate.get(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.checkout.get.accessGroups)],
          schema: GetCheckoutSchema,
        },
        getCheckoutPrivate
      );
      checkoutRoutesPrivate.get(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.checkout.get.accessGroups)],
          schema: GetCheckoutListPrivateSchema,
        },
        getCheckoutsListPrivate
      );
      checkoutRoutesPrivate.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.checkout.update.accessGroups)],
          schema: UpdateCheckoutSchema,
        },
        patchCheckout
      );
    },
    { prefix: `${config.privatePrefix}${prefix}` }
  );
}

export default routes;
