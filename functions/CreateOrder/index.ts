import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  badRequestResult,
  createdResult,
  internalServerErrorResult,
} from '../data/api-responses.models';
import {
  OrderPartial,
  OrderModel,
  orderSchemaValidator,
  Order,
} from '../data/order';

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
    const orderBody = req.body as OrderPartial;
    const orderBodyWithAuditInfo = {
      ...orderBody,
      createdOn: new Date(),
      updatedOn: new Date(),
      orderCompleted: false,
      orderPrice: null,
      contentIdentifier: null,
    } as Order;
    const mongooseClient = await MongooseClient.createClassAsync();
    const order = new OrderModel(orderBodyWithAuditInfo);
    await mongooseClient.createAsync(order);
    context.res = createdResult('Order created', order);
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
