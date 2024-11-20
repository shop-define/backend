import { FastifyInstance } from 'fastify';
import { uploadImage, deleteImage } from './images-controller';
import { UploadImageSchema, DeleteImageSchema } from './schemas/images-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/images';

  app.register(
    async (imagesRoutes) => {
      imagesRoutes.post(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.brand.delete.accessGroups)],
          schema: UploadImageSchema,
        },
        uploadImage
      );
      imagesRoutes.delete(
        '/:name',
        {
          preHandler: [app.validateRole(routesAccess.brand.delete.accessGroups)],
          schema: DeleteImageSchema,
        },
        deleteImage
      );
    },
    { prefix }
  );
}

export default routes;
