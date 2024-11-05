import { FastifyInstance } from 'fastify';
import { deleteGood, getGood, getGoodsList, patchGood, postGood } from './good-controller';
import {
  CreateGoodSchema,
  DeleteGoodSchema,
  GetGoodSchema,
  GetGoodsListSchema,
  UpdateGoodSchema,
} from './schemas/good-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/good';
  app.register(
    async (goodRoutes) => {
      goodRoutes.get('/:id', { schema: GetGoodSchema }, getGood);
      goodRoutes.get('/', { schema: GetGoodsListSchema }, getGoodsList);
      goodRoutes.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.good.create.accessGroups)],
          schema: CreateGoodSchema,
        },
        postGood
      );
      goodRoutes.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.good.update.accessGroups)],
          schema: UpdateGoodSchema,
        },
        patchGood
      );
      goodRoutes.delete(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.good.delete.accessGroups)],
          schema: DeleteGoodSchema,
        },
        deleteGood
      );
    },
    { prefix }
  );
}

export default routes;
