import { FastifyReply, FastifyRequest } from 'fastify';
import { getSettingsById, updateSettings } from './db/settings';
import { BackendError } from '../../index';

const settingsId = 1;

export async function getSettings(req: FastifyRequest, reply: FastifyReply) {
  const item = await getSettingsById(settingsId);

  if (!item) {
    throw new BackendError('Settings not set', 404);
  }

  reply.sendWithStatus(200, item);
}

interface IPatchSettingsBody {
  title: string;
  logo: string;
}

export async function patchSettings(req: FastifyRequest<{ Body: Partial<IPatchSettingsBody> }>, reply: FastifyReply) {
  const item = await updateSettings(settingsId, req.body);

  if (!item) {
    throw new BackendError('Settings not updated', 409);
  }

  reply.sendWithStatus(200, item);
}
