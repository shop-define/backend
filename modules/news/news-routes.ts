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
      newsRoutes.get('/:id', { schema: GetNewsSchemaPrivate }, getNewsPrivate);
      newsRoutes.get('/', { schema: GetNewsListSchemaPrivate }, getNewsListPrivate);
      newsRoutes.post(
        '/',
        {
          schema: CreateNewsSchema,
        },
        postNews
      );
      newsRoutes.patch(
        '/:id',
        {
          schema: UpdateNewsSchema,
        },
        patchNews
      );
      newsRoutes.delete(
        '/:id',
        {
          schema: DeleteNewsSchema,
        },
        deleteNews
      );
    },
    { prefix: `${config.privatePrefix}${prefix}` }
  );
}

export default routes;
