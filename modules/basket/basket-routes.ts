import { FastifyInstance } from 'fastify';
import { deleteBasket, GetBasket, getBasketList, postBasket } from './basket-controller';
import { GetBasketSchema, GetBasketListSchema, CreateBasketSchema, DeleteBasketSchema } from './schemas/basket-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/basket';
  app.register(
    async (basketRoutes) => {
      basketRoutes.get('/:goodId', { preHandler: [app.authenticate], schema: GetBasketSchema }, GetBasket);
      basketRoutes.get('/', { preHandler: [app.authenticate], schema: GetBasketListSchema }, getBasketList);
      basketRoutes.post(
        '/:goodId',
        {
          preHandler: [app.authenticate],
          schema: CreateBasketSchema,
        },
        postBasket
      );
      basketRoutes.delete(
        '/:goodId',
        {
          preHandler: [app.authenticate],
          schema: DeleteBasketSchema,
        },
        deleteBasket
      );
    },
    { prefix }
  );
}

export default routes;
