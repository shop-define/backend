import { FastifyReply, FastifyRequest } from 'fastify';
import { getRecipientByUserId } from './db/recipient';
import { BackendError } from '../../index';

export async function getRecipient(req: FastifyRequest, reply: FastifyReply) {
  const { userId } = req;

  const recipient = await getRecipientByUserId(userId as number);

  if (!recipient) {
    throw new BackendError('Recipient not found', 404);
  }

  reply.sendWithStatus(200, recipient);
}
