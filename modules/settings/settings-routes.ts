import { FastifyInstance } from 'fastify';
import { getSettings, patchSettings } from './settings-controller';
import { GetSettingsSchema, UpdateSettingsSchema } from './schemas/settings-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/settings';
  app.register(
    async (settingsRoutes) => {
      settingsRoutes.get(
        '/',
        {
          schema: GetSettingsSchema,
        },
        getSettings
      );
      settingsRoutes.patch(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.settings.update.accessGroups)],
          schema: UpdateSettingsSchema,
        },
        patchSettings
      );
    },
    { prefix }
  );
}

export default routes;
