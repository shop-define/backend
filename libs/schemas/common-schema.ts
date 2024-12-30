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
    image: Type.String(),
    parentId: Type.Optional(Type.Union([Type.Null(), Type.Number()], { default: null })),
  },
  { title: 'GoodCategory' }
);

export const BrandSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    image: Type.String(),
    description: Type.String(),
  },
  { title: 'Brand' }
);

export const GoodSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    price: Type.Number({ minimum: 0 }),
    count: Type.Integer({ minimum: 0 }),
    images: Type.Array(Type.String()),
    categoryId: Type.Optional(Type.Union([Type.Null(), GoodCategorySchema.properties.id], { default: null })),
    brandId: Type.Optional(Type.Union([Type.Null(), BrandSchema.properties.id], { default: null })),
    modifiedName: Type.String(),
    articleNumber: Type.String(),
  },
  { title: 'Good' }
);

export const FavoriteSchema = Type.Object(
  {
    goodId: GoodSchema.properties.id,
  },
  { title: 'Favorite' }
);

export const BasketSchema = Type.Object(
  {
    goodId: GoodSchema.properties.id,
    count: Type.Integer(),
  },
  { title: 'Basket' }
);

export const ImageSchema = Type.Object(
  {
    name: Type.String(),
  },
  { title: 'Image' }
);

export const DeliveryMethodSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    image: Type.String(),
  },
  { title: 'DeliveryMethod' }
);

export const PaymentMethodSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    description: Type.String(),
    image: Type.String(),
  },
  { title: 'DeliveryMethod' }
);

export const TransactionSchema = Type.Object(
  {
    id: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    status: Type.Enum({ pending: 'pending', success: 'success', error: 'error' }),
    price: Type.Number({ minimum: 0 }),
    checkoutId: Type.String(),
    providerData: Type.String(),
  },
  { title: 'Transaction' }
);

export const RecipientSchema = Type.Object(
  {
    name: Type.String(),
    address: Type.String(),
    phone: Type.String(),
  },
  { title: 'Recipient' }
);

export const CheckoutSchema = Type.Object(
  {
    id: Type.String(),
    userId: Type.Number(),

    paymentMethodId: Type.String(),
    paymentMethodName: Type.String(),

    deliveryMethodId: Type.String(),
    deliveryMethodName: Type.String(),

    recipientName: RecipientSchema.properties.name,
    recipientAddress: RecipientSchema.properties.address,
    recipientPhone: RecipientSchema.properties.phone,

    goodsIdList: Type.Array(Type.String()),
    goodsPrice: Type.Array(Type.Number({ minimum: 0 })),

    goodsCount: Type.Array(Type.Number({ minimum: 1 })),
    goodsName: Type.Array(Type.String()),

    paymentTotal: Type.Number({ minimum: 0 }),

    status: Type.Enum({
      created: 'created',
      payed: 'payed',
      delivery: 'delivery',
      delivered: 'delivered',
      success: 'success',
      canceled: 'canceled',
    }),
  },
  { title: 'Checkout' }
);
