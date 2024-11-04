import { FastifyInstance } from 'fastify';
import { getCategory, getCategoriesList, postCategory } from './category-controller';
import { CreateCategorySchema, GetCategoriesListSchema, GetCategorySchema } from './schemas/category-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/good-categories';
  app.register(
    async (goodCategoriesRoutes) => {
      goodCategoriesRoutes.get('/:id', { schema: GetCategorySchema }, getCategory);
      goodCategoriesRoutes.get('/', { schema: GetCategoriesListSchema }, getCategoriesList);
      goodCategoriesRoutes.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.goodCategories.create.accessGroups)],
          schema: CreateCategorySchema,
        },
        postCategory
      );
    },
    { prefix }
  );
}

export default routes;
