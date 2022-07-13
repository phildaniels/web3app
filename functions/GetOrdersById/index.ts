import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  internalServerErrorResult,
  notFoundResult,
  okResult,
} from '../data/api-responses.models';
import { OrderPartial, OrderModel } from '../data/order';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const mongooseClient = await MongooseClient.createClassAsync();
    const orderId = context.bindingData.id;
    if (orderId == null) {
      context.res = notFoundResult('Order id is required');
      return;
    }
    const order = await mongooseClient.getAync<OrderPartial>(OrderModel, {
      _id: orderId,
    });
    if (order != null) {
      context.res = okResult(
        `Success in retrieving order with id ${orderId}`,
        order
      );
      return;
    }
    context.res = notFoundResult(`Order with id ${orderId} not found`);
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
