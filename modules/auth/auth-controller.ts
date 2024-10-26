import { FastifyReply, FastifyRequest } from 'fastify';
import { decodeToken, generatedAccessToken, generatedRefreshToken } from '../../libs/jwt/jwt';
import { deleteEmailCode, getEmailCode, saveEmailCode } from './db/email-codes';
import { sendEmailCode } from '../../libs/mailer/send-mail';
import { createAccount } from '../user/db/user';
import {BackendError} from "../../index";

import { config } from '../../config';

interface ILoginBody {
  email: string;
}

interface ILoginConfirmBody {
  code: string;
  email: string;
}

export async function refreshAccessToken(req: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new BackendError('Refresh token not found', 401);

  try {
    const decoded = await decodeToken(req.jwt, refreshToken);
    const newAccessToken = await generatedAccessToken(req.jwt, decoded.id, decoded.email);

    reply.sendWithStatus(200,{ accessToken: newAccessToken })
  } catch (err) {
    throw new BackendError('Invalid refresh token', 401);
  }
}

export async function loginEmail(req: FastifyRequest<{ Body: ILoginBody }>, reply: FastifyReply) {
  const { email } = req.body;
  const generatedCode =
    config.nodeEnv === 'development' ? Number(config.dev.authCode) : Math.floor(Math.random() * 100000);
  await saveEmailCode(email, generatedCode);
  try {
    if (config.nodeEnv !== 'development') {
      sendEmailCode(email, generatedCode);
    }
  } catch (e) {
    throw new BackendError(e as Object, 400);
  }

  reply.sendWithStatus(200, 'ok');
}

export async function loginEmailValidateCode(
  req: FastifyRequest<{ Body: ILoginConfirmBody }>,
  reply: FastifyReply
) {
  const { email, code } = req.body;

  const emailCode = await getEmailCode(email);
  if (!emailCode) {
    throw new BackendError('Code not found', 400);
  }

  if (emailCode !== Number(code)) {
    throw new BackendError('Code not match', 400);
  }

  const account = await createAccount({ email });
  await deleteEmailCode(email);

  if (!account) {
    throw new BackendError('User not created', 409);
  }

  const accessToken = await generatedAccessToken(req.jwt, account.id, account.email);
  const refreshToken = await generatedRefreshToken(req.jwt, account.id, account.email);

  reply
    .setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
    })
    .sendWithStatus(200, {
      accessToken: accessToken,
      profile: {
        id: account?.id,
        email: account?.email,
      }
    })
}
