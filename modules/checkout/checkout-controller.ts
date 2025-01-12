import { FastifyReply, FastifyRequest } from 'fastify';
import { getCheckouts, getCheckoutById, getTotalCheckouts, createCheckout, updateCheckout } from './db/checkout';
import { BackendError } from '../../index';
import { getCheckoutPayment } from '../../libs/helpers/get-checkout-payment';

export async function getCheckout(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
  isVerify = true
) {
  const checkoutId = req.params.id;

  const checkout = await getCheckoutById(checkoutId);

  if (!checkout) {
    throw new BackendError('Checkout not found', 404);
  }

  if (isVerify && checkout.userId !== req.userId) {
    throw new BackendError('Checkout not permitted', 403);
  }

  reply.sendWithStatus(200, {
    ...checkout,
    paymentTotal: getCheckoutPayment(checkout),
  });
}

export async function getCheckoutPrivate(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getCheckout(req, reply, false);
}

export async function getCheckoutsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply,
  depersonal = false
) {
  const { offset = 0, limit = 10 } = req.query;

  const checkoutsList = await getCheckouts(depersonal ? undefined : (req.userId as number), offset, limit);
  const checkoutsTotal = await getTotalCheckouts(depersonal ? undefined : (req.userId as number));

  if (!checkoutsList) {
    throw new BackendError('Checkouts not found', 404);
  }

  const preparedCheckouts = checkoutsList.map((checkout) => ({
    ...checkout,
    paymentTotal: getCheckoutPayment(checkout),
  }));

  reply.sendWithPagination(200, preparedCheckouts, checkoutsTotal);
}

export async function getCheckoutsListPrivate(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  return getCheckoutsList(req, reply, true);
}

interface ICreateCheckoutBody {
  deliveryMethodId: string;

  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;

  goodsIdList: string[];
  goodsCount: number[];
}

export async function postCheckout(req: FastifyRequest<{ Body: ICreateCheckoutBody }>, reply: FastifyReply) {
  if (req.body.goodsIdList.length !== req.body.goodsCount.length || req.body.goodsIdList.length <= 0) {
    throw new BackendError('Goods count not correct', 400);
  }

  const checkout = await createCheckout(req.userId as number, req.body);

  if (!checkout) {
    throw new BackendError('Checkout not created', 409);
  }

  reply.sendWithStatus(200, {
    ...checkout,
    paymentTotal: getCheckoutPayment(checkout),
  });
}

type CheckoutUpdateBody = {
  userId: number;

  paymentMethodId: string;
  paymentMethodName: string;

  deliveryMethodId: string;
  deliveryMethodName: string;

  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;

  goodsIdList: string[];
  goodsPrice: number[];
  goodsCount: number[];
  goodsName: string[];

  status: 'created' | 'payed' | 'delivery' | 'delivered' | 'success' | 'canceled';
};

export async function patchCheckout(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<CheckoutUpdateBody> }>,
  reply: FastifyReply
) {
  const checkout = await updateCheckout(req.params.id, req.body);

  if (!checkout) {
    throw new BackendError('Checkout not updated', 409);
  }

  reply.sendWithStatus(200, {
    ...checkout,
    paymentTotal: getCheckoutPayment(checkout),
  });
}
