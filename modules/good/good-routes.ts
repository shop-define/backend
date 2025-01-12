import { FastifyInstance } from 'fastify';
import {
  deleteGood,
  getGoodGroupPrivate,
  getGoodGroupPublic,
  getGoodPrivate,
  getGoodPublic,
  getGoodsListPrivate,
  getGoodsListPublic,
  patchGood,
  postGood,
} from './good-controller';
import {
  CreateGoodSchema,
  DeleteGoodSchema,
  GetGoodGroup,
  GetGoodPrivateGroup,
  GetGoodPrivateSchema,
  GetGoodSchema,
  GetGoodsListPrivateSchema,
  GetGoodsListSchema,
  UpdateGoodSchema,
} from './schemas/good-schema';
import { routesAccess } from '../../config/routes-access';
import { config } from '../../config';

async function routes(app: FastifyInstance) {
  const prefix = '/good';
  app.register(
    async (goodRoutes) => {
      goodRoutes.get('/:id', { schema: GetGoodSchema }, getGoodPublic);
      goodRoutes.get('/:id/group', { schema: GetGoodGroup }, getGoodGroupPublic);
      goodRoutes.get('/', { schema: GetGoodsListSchema }, getGoodsListPublic);
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

  app.register(
    async (goodPrivateRoutes) => {
      goodPrivateRoutes.get(
        '/',
        {
          schema: GetGoodsListPrivateSchema,
          preHandler: [app.validateRole(routesAccess.good.privateGet.accessGroups)],
        },
        getGoodsListPrivate
      );
      goodPrivateRoutes.get(
        '/:id',
        {
          schema: GetGoodPrivateSchema,
          preHandler: [app.validateRole(routesAccess.good.privateGet.accessGroups)],
        },
        getGoodPrivate
      );
      goodPrivateRoutes.get(
        '/:id/group',
        { schema: GetGoodPrivateGroup, preHandler: [app.validateRole(routesAccess.good.privateGet.accessGroups)] },
        getGoodGroupPrivate
      );
    },
    { prefix: `${config.privatePrefix}${prefix}` }
  );
}

export default routes;
