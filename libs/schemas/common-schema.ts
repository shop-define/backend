import {Type} from "@sinclair/typebox";

export const ResponseWithStatus = Type.Object({
  status: Type.String(),
  data: Type.Any(), // или Type.Unknown(), если вы знаете, что это будет тип "data"
});
