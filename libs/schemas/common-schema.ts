import {TSchema, Type} from "@sinclair/typebox";

export const ResponseWithStatus = (dataType: TSchema) => {
  return Type.Object({
    status: Type.Union([Type.Literal('ok'), Type.Literal('error')]),
    data: dataType,
  }, {title: 'ResponseWithStatus'});
};

export const ErrorSchema = ResponseWithStatus(Type.Object({
  message: Type.String(),
}));

export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
}, {title: 'User'})

export const GoodCategorySchema = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  description: Type.String(),
  parentId: Type.Optional(Type.Integer()),
}, {title: 'GoodCategory'})
