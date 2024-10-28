import { FastifyReply, FastifyRequest } from 'fastify';
import { getAccountProfile } from './db/user';
import { BackendError } from '../../index';

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
  const profile = await getAccountProfile(Number((req.user as { id: number }).id));

  if (!profile) {
    throw new BackendError('User not found', 404);
  }

  reply.sendWithStatus(200, { profile });
}
