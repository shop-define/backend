import { FastifyInstance } from 'fastify';
import {
  postNews,
  patchNews,
  deleteNews,
  getNewsPublic,
  getNewsPrivate,
  getNewsListPublic,
  getNewsListPrivate,
} from './news-controller';
import {
  CreateNewsSchema,
  GetNewsSchema,
  GetNewsListSchema,
  UpdateNewsSchema,
  DeleteNewsSchema,
  GetNewsSchemaPrivate,
  GetNewsListSchemaPrivate,
} from './schemas/news-schema';
import { routesAccess } from '../../config/routes-access';
import { config } from '../../config';

async function routes(app: FastifyInstance) {
  const prefix = '/news';
  app.register(
    async (newsRoutes) => {
      newsRoutes.get('/:id', { schema: GetNewsSchema }, getNewsPublic);
      newsRoutes.get('/', { schema: GetNewsListSchema }, getNewsListPublic);
    },
    { prefix }
  );

  app.register(
    async (newsRoutes) => {
      newsRoutes.get(
        '/:id',
        { preHandler: [app.validateRole(routesAccess.news.privateGet.accessGroups)], schema: GetNewsSchemaPrivate },
        getNewsPrivate
      );
      newsRoutes.get(
        '/',
        { preHandler: [app.validateRole(routesAccess.news.privateGet.accessGroups)], schema: GetNewsListSchemaPrivate },
        getNewsListPrivate
      );
      newsRoutes.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.news.create.accessGroups)],
          schema: CreateNewsSchema,
        },
        postNews
      );
      newsRoutes.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.news.update.accessGroups)],
          schema: UpdateNewsSchema,
        },
        patchNews
      );
      newsRoutes.delete(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.news.delete.accessGroups)],
          schema: DeleteNewsSchema,
        },
        deleteNews
      );
    },
    { prefix: `${config.privatePrefix}${prefix}` }
  );
}

export default routes;
