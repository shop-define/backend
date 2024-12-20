import { FastifyInstance } from 'fastify';
import { getCategory, getCategoriesList, postCategory, patchCategory, deleteCategory } from './category-controller';
import {
  CreateCategorySchema,
  DeleteCategorySchema,
  GetCategoriesListSchema,
  GetCategorySchema,
  UpdateCategorySchema,
} from './schemas/category-schema';
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
      goodCategoriesRoutes.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.goodCategories.update.accessGroups)],
          schema: UpdateCategorySchema,
        },
        patchCategory
      );
      goodCategoriesRoutes.delete(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.goodCategories.delete.accessGroups)],
          schema: DeleteCategorySchema,
        },
        deleteCategory
      );
    },
    { prefix }
  );
}

export default routes;
