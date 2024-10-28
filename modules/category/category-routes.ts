import { FastifyInstance } from 'fastify';
import { getCategory, getCategoriesList } from './category-controller';
import { GetCategoriesListSchema, GetCategorySchema } from './schemas/category-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/good-categories';
  app.register(
    async (goodCategoriesRoutes) => {
      goodCategoriesRoutes.get('/:id', { schema: GetCategorySchema }, getCategory);
      goodCategoriesRoutes.get('/', { schema: GetCategoriesListSchema }, getCategoriesList);
    },
    { prefix }
  );
}

export default routes;
