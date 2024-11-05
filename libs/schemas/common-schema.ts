import { TSchema, Type } from '@sinclair/typebox';

export const ResponseWithStatus = (dataType: TSchema) => {
  return Type.Object(
    {
      status: Type.Union([Type.Literal('ok'), Type.Literal('error')]),
      data: dataType,
    },
    { title: 'ResponseWithStatus' }
  );
};

export const ResponseWithPagination = (dataType: TSchema) => {
  return Type.Object(
    {
      status: Type.Union([Type.Literal('ok'), Type.Literal('error')]),
      data: dataType,
      total: Type.Integer(),
    },
    { title: 'ResponseWithPagination' }
  );
};

export const UserRoleSchema = Type.Array(
  Type.Enum({
    seller: 'seller',
    customer: 'customer',
    admin: 'admin',
  })
);

export const ErrorSchema = ResponseWithStatus(
  Type.Object({
    message: Type.String(),
  })
);

export const UserSchema = Type.Object(
  {
    id: Type.String(),
    email: Type.String(),
    roles: UserRoleSchema,
  },
  { title: 'User' }
);

export const GoodCategorySchema = Type.Object(
  {
    id: Type.Integer(),
    title: Type.String(),
    description: Type.String(),
    parentId: Type.Optional(Type.Union([Type.Null(), Type.Number()], { default: null })),
  },
  { title: 'GoodCategory' }
);

export const GoodSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    description: Type.String(),
    price: Type.Number(),
    categoryId: GoodCategorySchema.properties.id,
  },
  { title: 'Good' }
);
