import { CheckoutSchema } from '../schemas/common-schema';
import { Static, Type } from '@sinclair/typebox';

const T = Type.Pick(CheckoutSchema, ['goodsPrice', 'goodsCount']);

type Checkout = Static<typeof T>;

export function getCheckoutPayment(checkout: Checkout) {
  let paymentTotal = 0;
  checkout.goodsCount.forEach((count, index) => {
    paymentTotal += count * checkout.goodsPrice[index];
  });
  return paymentTotal;
}
