import { FastifyReply, FastifyRequest } from 'fastify';
import { uploadImageToStorage, deleteImageFromStorage } from './storage/images';
import { BackendError } from '../../index';

interface ImageBody {
  image: {
    toBuffer: () => Promise<Buffer>;
    mimetype: string;
  };
}

export async function uploadImage(req: FastifyRequest<{ Body: ImageBody }>, reply: FastifyReply) {
  const { mimetype } = req.body.image;

  const preparedBuffer = await req.body.image.toBuffer();
  const parts = mimetype.split('/');
  const extension = parts[parts.length - 1];

  const name = await uploadImageToStorage(preparedBuffer, extension);
  if (!name) {
    throw new BackendError('Image not uploaded', 409);
  }

  reply.sendWithStatus(200, {
    name,
  });
}

export async function deleteImage(req: FastifyRequest<{ Params: { name: string } }>, reply: FastifyReply) {
  const res = await deleteImageFromStorage(req.params.name);

  if (!res) {
    throw new BackendError('Image not deleted', 409);
  }

  reply.sendWithStatus(200, {
    name: req.params.name,
  });
}
