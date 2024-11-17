import { FastifyInstance } from 'fastify';
import { deleteFavorite, checkFavoriteGood, getFavoritesList, postFavorite } from './favorite-controller';
import {
  CheckFavoriteSchema,
  GetFavoritesListSchema,
  CreateFavoriteSchema,
  DeleteFavoriteSchema,
} from './schemas/favorite-schema';

async function routes(app: FastifyInstance) {
  const prefix = '/good-favorites';
  app.register(
    async (favoriteRoutes) => {
      favoriteRoutes.get(
        '/:goodId',
        { preHandler: [app.authenticate], schema: CheckFavoriteSchema },
        checkFavoriteGood
      );
      favoriteRoutes.get('/', { preHandler: [app.authenticate], schema: GetFavoritesListSchema }, getFavoritesList);
      favoriteRoutes.post(
        '/:goodId',
        {
          preHandler: [app.authenticate],
          schema: CreateFavoriteSchema,
        },
        postFavorite
      );
      favoriteRoutes.delete(
        '/:goodId',
        {
          preHandler: [app.authenticate],
          schema: DeleteFavoriteSchema,
        },
        deleteFavorite
      );
    },
    { prefix }
  );
}

export default routes;
