import { FastifyReply, FastifyRequest } from 'fastify';
import {  getAccountProfile } from './db/user';

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
  const profile = await getAccountProfile(Number((req.user as { id: number }).id));

  if (!profile) {
    return reply.code(404).send({ message: 'profile not found' });
  }

  reply.send({ profile });
}
