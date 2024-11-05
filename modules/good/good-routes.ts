import { FastifyInstance } from 'fastify';
import { getGood, getGoodsList } from './good-controller';
import { GetGoodSchema, GetGoodsListSchema } from './schemas/good-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/good';
  app.register(
    async (goodCategoriesRoutes) => {
      goodCategoriesRoutes.get('/:id', { schema: GetGoodSchema }, getGood);
      goodCategoriesRoutes.get('/', { schema: GetGoodsListSchema }, getGoodsList);
    },
    { prefix }
  );
}

export default routes;
