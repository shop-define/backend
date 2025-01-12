import { JWT } from '@fastify/jwt';
import { TokenPayload } from '../types/common-types';

const AccessTokenExpiration = '7d';
const RefreshTokenExpiration = '7d';

export async function generatedAccessToken(ctx: JWT, payload: TokenPayload) {
  return ctx.sign(payload, { expiresIn: AccessTokenExpiration });
}
export async function generatedRefreshToken(ctx: JWT, payload: TokenPayload) {
  return ctx.sign(payload, { expiresIn: RefreshTokenExpiration });
}
export async function decodeToken(ctx: JWT, token: string): Promise<TokenPayload> {
  return ctx.verify(token);
}
