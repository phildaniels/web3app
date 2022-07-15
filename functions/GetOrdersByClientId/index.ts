import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  badRequestResult,
  internalServerErrorResult,
  noContentResult,
  okResult,
} from '../data/api-responses.models';
import { Order, OrderModel } from '../data/order';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const mongooseClient = await MongooseClient.createClassAsync();
    const clientUniqueId = context.bindingData.id;
    if (clientUniqueId == null) {
      context.res = badRequestResult('Client id is required');
      return;
    }
    const orders = await mongooseClient.getAync<Order>(OrderModel, {
      clientUniqueId: clientUniqueId,
    });
    if (orders != null) {
      context.res = okResult(
        `Success in retrieving orders with clientId ${clientUniqueId}`,
        orders
      );
      return;
    }
    context.res = noContentResult();
  } catch (e) {
    context.log.error('GetOrdersByClientId function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
