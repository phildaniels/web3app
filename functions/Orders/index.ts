import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  internalServerErrorResult,
  noContentResult,
  okResult,
} from '../data/api-responses.models';
import { IOrder, Order } from '../data/order';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const mongooseClient = await MongooseClient.createClassAsync();
    const orders = await mongooseClient.getAync<IOrder>(Order);
    if (orders?.length != null && orders.length > 0) {
      context.res = okResult('Success in retrieving orders', orders);
      return;
    }
    context.res = noContentResult();
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
