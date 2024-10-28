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
}, {title: 'UserResponse'})