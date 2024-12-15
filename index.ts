import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJWT, { JWT } from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

import { disconnectDatabase } from './libs/db/connect';
import { setupBucket } from './libs/storage';
import { config } from './config';
import { TokenPayload, UserRole } from './libs/types/common-types';

declare module 'fastify' {
  interface FastifyInstance {
    // eslint-disable-next-line
    authenticate: (request: any, reply: any) => Promise<void>;
    // eslint-disable-next-line
    validateRole: (targetRoles: UserRole[]) => (request: any) => Promise<void>;
  }
  interface FastifyRequest {
    jwt: JWT;
    userId?: number;
  }

  interface FastifyReply {
    sendWithStatus(statusCode: number, payload?: string | object | boolean): void;
    sendWithPagination(statusCode: number, payload?: string | object, total?: number): void;
  }
}

export class BackendError extends Error {
  statusCode: number;
  constructor(message: string | object, statusCode = 500) {
    if (typeof message === 'string') {
      super(message);
    } else {
      super(JSON.stringify(message));
    }
    this.name = 'BackendError';
    this.statusCode = statusCode;
  }
}

const app = Fastify({
  logger: {
    level: 'info',
  },
});

app.register(import('@fastify/cors'), {
  origin: config.app.originUrls,
});

// authentication
app.register(fastifyJWT, { secret: config.jwt.secret });
app.register(fastifyCookie);
app.decorate('authenticate', async function (request: FastifyRequest) {
  try {
    // Authorization: Bearer <token>
    request.userId = (await request.jwtVerify<TokenPayload>()).id;
  } catch (err) {
    throw new BackendError('Unauthorized', 401);
  }
});
app.decorate(
  'validateRole',
  (targetRoles: UserRole[]) =>
    async function (request: FastifyRequest) {
      let roles: UserRole[] = [];
      try {
        // Authorization: Bearer <token>
        roles = (await request.jwtVerify<TokenPayload>()).roles;
      } catch (err) {
        throw new BackendError('Unauthorized', 401);
      }

      const isAccess = roles.some((role) => targetRoles.includes(role));
      if (!isAccess) {
        throw new BackendError('Permission denied', 403);
      }
    }
);

app.decorateReply('sendWithStatus', function (this: FastifyReply, statusCode: number, payload: string | object) {
  this.code(statusCode).send({
    status: [200, 201].includes(statusCode) ? 'ok' : 'error',
    data: payload,
  });
});
app.decorateReply(
  'sendWithPagination',
  function (this: FastifyReply, statusCode: number, payload: string | object, total: undefined | number = 0) {
    this.code(statusCode).send({
      status: [200, 201].includes(statusCode) ? 'ok' : 'error',
      data: payload,
      total,
    });
  }
);

app.addHook('preHandler', (request: FastifyRequest, _, next) => {
  request.jwt = app.jwt;
  return next();
});

// swagger
app.register(import('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Shop define backend',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});
app.register(import('@fastify/swagger-ui'), {
  routePrefix: config.app.swaggerPath,
  uiConfig: {
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

app.register(import('@fastify/multipart'), {
  attachFieldsToBody: true,
});

app.setErrorHandler(async (err, _, reply) => {
  console.log(err.message);
  if (err instanceof BackendError) {
    reply.code(err.statusCode).send({
      status: 'error',
      data: {
        message: err.message,
      },
    });
  } else {
    // Обработка других типов ошибок
    reply.code(500).send({
      status: 'error',
      data: {
        message: 'Internal Server Error',
        err: err,
      },
    });
  }
});

// api routes
app.register(import('./modules/user/user-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/auth/auth-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/category/category-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/good/good-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/favorite/favorite-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/basket/basket-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/brand/brand-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/images/images-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/delivery-methods/delivery-methods-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/payment-methods/payment-methods-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/transaction/transaction-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/checkout/checkout-routes'), {
  prefix: config.app.apiPrefix,
});
app.register(import('./modules/recipient/recipient-routes'), {
  prefix: config.app.apiPrefix,
});
app.get('/healthcheck', (_, res) => {
  res.send({ message: 'Success' });
});

async function main() {
  app.listen({ port: +config.app.port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
  setupBucket();
}

// shutdown
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await app.close();
    await disconnectDatabase();
    process.exit(0);
  });
});

main()
  .then(async () => {
    await disconnectDatabase();
  })
  .catch(async (e) => {
    console.error(e);
    await disconnectDatabase();
    process.exit(1);
  });
