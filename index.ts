import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJWT, { JWT } from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

import { disconnectDatabase } from './libs/db/connect';
import { config } from './config';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    jwt: JWT;
  }
}

export class BackendError extends Error {
  statusCode: number;
  constructor(message: string | Record<any, any>, statusCode = 500) {
    if(typeof message === 'string') {
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

// authentication
app.register(fastifyJWT, { secret: config.jwt.secret });
app.register(fastifyCookie);
app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    // Authorization: Bearer <token>
    await request.jwtVerify();
  } catch (err) {
    console.error(err);
    return reply.code(401).send({ message: 'Unauthorized' });
  }
});
app.addHook('preHandler', (request: FastifyRequest, _, next) => {
  request.jwt = app.jwt;
  return next();
});

app.addHook('onSend', (request, reply, payload, done) => {
  if (!request.url.startsWith(config.app.swaggerPath)) {
    const err = null;
    const newPayload = JSON.stringify({status: 'ok', data: payload ?? null})
    done(err, newPayload)
  } else {
    done(null, payload);
  }
})

// swagger
app.register(import('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Shop define backend',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3000', // Замените на ваш адрес
      },
    ],
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

app.setErrorHandler(async (err, _, reply) => {
  console.log(err.message)
  if (err instanceof BackendError) {
    reply.code(err.statusCode).send({
      status: 'error',
      data: {
        message: err.message,
      }
    });
  } else {
    // Обработка других типов ошибок
    reply.code(500).send({
      status: 'error',
      data: {
        message: 'Internal Server Error',
        err: err,
      }
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
app.get('/healthcheck', (_, res) => {
  res.send({ message: 'Success' });
});

async function main() {
  app.listen({ port: +config.app.port }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
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
