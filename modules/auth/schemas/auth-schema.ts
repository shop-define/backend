import { Type } from '@sinclair/typebox';
import { ErrorSchema, ResponseWithStatus, UserSchema } from '../../../libs/schemas/common-schema';

const RefreshTokenSchema = {
  tags: ['Auth'],
  cookies: Type.Object({
    refreshToken: Type.String(),
  }),
  response: {
    200: ResponseWithStatus(
      Type.Object(
        {
          accessToken: Type.String(),
        },
        { title: 'IRefreshTokenResponse' }
      )
    ),
    401: ErrorSchema,
  },
};

const ILoginBodySchema = {
  tags: ['Auth'],
  body: Type.Object(
    {
      email: Type.String({ format: 'email' }),
    },
    { required: ['email'], title: 'ILoginBody' }
  ),
  response: {
    200: ResponseWithStatus(Type.Null()),
    400: ErrorSchema,
  },
};

const ILoginConfirmBodySchema = {
  tags: ['Auth'],
  body: Type.Object(
    {
      code: Type.String(),
      email: Type.String({ format: 'email' }),
    },
    { required: ['code', 'email'], title: 'ILoginConfirmBody' }
  ),
  response: {
    200: ResponseWithStatus(
      Type.Object(
        {
          accessToken: Type.String(),
          profile: UserSchema,
        },
        { title: 'ILoginConfirmResponse' }
      )
    ),
    400: ErrorSchema,
    409: ErrorSchema,
  },
};

export { RefreshTokenSchema, ILoginBodySchema, ILoginConfirmBodySchema };
