import { FastifyInstance } from 'fastify';
import { getCategory } from './category-controller';
import {GetCategorySchema} from "./schemas/category-schema";

async function routes(app: FastifyInstance) {
  const prefix = '/good-categories';
  app.register(
    async (goodCategoriesRoutes) => {
      goodCategoriesRoutes.get('/:id', {schema: GetCategorySchema }, getCategory);
    },
    { prefix }
  );
}

export default routes;
