import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  badRequestResult,
  internalServerErrorResult,
  notFoundResult,
  okResult,
} from '../data/api-responses.models';
import { OrderPartial, OrderModel, Order } from '../data/order';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const mongooseClient = await MongooseClient.createClassAsync();
    const orderId = context.bindingData.id;
    if (orderId == null) {
      context.res = badRequestResult('Order id is required');
      return;
    }
    const order = await mongooseClient.getAync<Order>(OrderModel, {
      _id: orderId,
    });
    if (order != null && order.length > 0) {
      context.res = okResult(
        `Success in retrieving order with id ${orderId}`,
        order[0]
      );
      return;
    }
    context.res = notFoundResult(`Order with id ${orderId} not found`);
  } catch (e) {
    context.log.error('GetOrderById function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
