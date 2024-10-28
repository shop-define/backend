import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import {ErrorSchema, GoodCategorySchema, ResponseWithStatus} from "../../../libs/schemas/common-schema";

export const GetCategorySchema: FastifySchema = {
  tags: ['good-categories'],
  response: {
    200: ResponseWithStatus(GoodCategorySchema),
    404: ResponseWithStatus(ErrorSchema)
  },
  params: Type.Object({
    id: Type.Integer(),
  }),
};
