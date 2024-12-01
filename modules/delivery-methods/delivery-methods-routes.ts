import { FastifyInstance } from 'fastify';
import {
  getDeliveryMethod,
  getDeliveryMethodsList,
  postDeliveryMethod,
  patchDeliveryMethod,
  deleteDeliveryMethod,
} from './delivery-methods-controller';
import {
  CreateDeliveryMethodSchema,
  GetDeliveryMethodSchema,
  GetDeliveryMethodsListSchema,
  UpdateDeliveryMethodSchema,
  DeleteDeliveryMethodSchema,
} from './schemas/delivery-methods-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/delivery-methods';
  app.register(
    async (deliveryMethods) => {
      deliveryMethods.get('/:id', { schema: GetDeliveryMethodSchema }, getDeliveryMethod);
      deliveryMethods.get('/', { schema: GetDeliveryMethodsListSchema }, getDeliveryMethodsList);
      deliveryMethods.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.deliveryMethods.create.accessGroups)],
          schema: CreateDeliveryMethodSchema,
        },
        postDeliveryMethod
      );
      deliveryMethods.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.deliveryMethods.update.accessGroups)],
          schema: UpdateDeliveryMethodSchema,
        },
        patchDeliveryMethod
      );
      deliveryMethods.delete(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.deliveryMethods.delete.accessGroups)],
          schema: DeleteDeliveryMethodSchema,
        },
        deleteDeliveryMethod
      );
    },
    { prefix }
  );
}

export default routes;
