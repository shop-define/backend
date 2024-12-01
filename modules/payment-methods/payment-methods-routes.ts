import { FastifyInstance } from 'fastify';
import {
  getPaymentMethod,
  getPaymentMethodsList,
  postPaymentMethod,
  patchPaymentMethod,
  deletePaymentMethod,
} from './payment-methods-controller';
import {
  CreatePaymentMethodSchema,
  GetPaymentMethodSchema,
  GetPaymentMethodsListSchema,
  UpdatePaymentMethodSchema,
  DeletePaymentMethodSchema,
} from './schemas/payment-methods-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/payment-methods';
  app.register(
    async (paymentMethods) => {
      paymentMethods.get('/:id', { schema: GetPaymentMethodSchema }, getPaymentMethod);
      paymentMethods.get('/', { schema: GetPaymentMethodsListSchema }, getPaymentMethodsList);
      paymentMethods.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.paymentMethods.create.accessGroups)],
          schema: CreatePaymentMethodSchema,
        },
        postPaymentMethod
      );
      paymentMethods.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.paymentMethods.update.accessGroups)],
          schema: UpdatePaymentMethodSchema,
        },
        patchPaymentMethod
      );
      paymentMethods.delete(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.paymentMethods.delete.accessGroups)],
          schema: DeletePaymentMethodSchema,
        },
        deletePaymentMethod
      );
    },
    { prefix }
  );
}

export default routes;
