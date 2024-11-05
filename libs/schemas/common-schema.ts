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

export const BrandSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    description: Type.String(),
  },
  { title: 'GoodCategory' }
);

export const GoodSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    price: Type.Number({ minimum: 0 }),
    count: Type.Integer({ minimum: 0 }),
    categoryId: Type.Optional(Type.Union([Type.Null(), GoodCategorySchema.properties.id], { default: null })),
    brandId: Type.Optional(Type.Union([Type.Null(), BrandSchema.properties.id], { default: null })),
  },
  { title: 'Good' }
);
