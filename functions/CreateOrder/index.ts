import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  badRequestResult,
  createdResult,
  internalServerErrorResult,
} from '../data/api-responses.models';
import { IOrder, Order, orderSchemaValidator } from '../data/order';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    if (!orderSchemaValidator(req.body)) {
      context.res = badRequestResult(
        'Invalid order',
        orderSchemaValidator.errors?.map((error) => error.message ?? '') ?? []
      );
      return;
    }
    const orderBody = req.body as IOrder;
    const mongooseClient = await MongooseClient.createClassAsync();
    const order = new Order(orderBody);
    await mongooseClient.createAsync(order);
    context.res = createdResult('Order created', order);
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
