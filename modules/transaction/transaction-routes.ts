import { FastifyInstance } from 'fastify';
import { getTransaction, getTransactionsList, patchTransaction } from './transaction-controller';
import { GetTransactionSchema, GetTransactionsListSchema, UpdateTransactionSchema } from './schemas/transaction-schema';
import { routesAccess } from '../../config/routes-access';

async function routes(app: FastifyInstance) {
  const prefix = '/transaction';
  app.register(
    async (transactionRoutes) => {
      transactionRoutes.get(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.transaction.get.accessGroups)],
          schema: GetTransactionSchema,
        },
        getTransaction
      );
      transactionRoutes.get(
        '/',
        {
          preHandler: [app.validateRole(routesAccess.transaction.get.accessGroups)],
          schema: GetTransactionsListSchema,
        },
        getTransactionsList
      );
      transactionRoutes.patch(
        '/:id',
        {
          preHandler: [app.validateRole(routesAccess.transaction.update.accessGroups)],
          schema: UpdateTransactionSchema,
        },
        patchTransaction
      );
    },
    { prefix }
  );
}

export default routes;
