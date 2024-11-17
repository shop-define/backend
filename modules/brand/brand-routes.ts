import { FastifyInstance } from 'fastify';
import { getBrand, getBrandsList, postBrand, patchBrand, deleteBrand } from './brand-controller';
import {
  CreateBrandSchema,
  GetBrandSchema,
  GetBrandsListSchema,
  UpdateBrandSchema,
  DeleteBrandSchema,
} from './schemas/brand-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/brand';
  app.register(
    async (brandRoutes) => {
      brandRoutes.get('/:id', { schema: GetBrandSchema }, getBrand);
      brandRoutes.get('/', { schema: GetBrandsListSchema }, getBrandsList);
      brandRoutes.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.brand.create.accessGroups)],
          schema: CreateBrandSchema,
        },
        postBrand
      );
      brandRoutes.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.brand.update.accessGroups)],
          schema: UpdateBrandSchema,
        },
        patchBrand
      );
      brandRoutes.delete(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.brand.delete.accessGroups)],
          schema: DeleteBrandSchema,
        },
        deleteBrand
      );
    },
    { prefix }
  );
}

export default routes;
