import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { MongooseClient } from '../clients/mongoose.client';
import {
  badRequestResult,
  internalServerErrorResult,
  okResult,
} from '../data/api-responses.models';
import {
  CompleteOrderPartial,
  completeOrderSchemaValidator,
  Order,
  OrderModel,
} from '../data/order';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    if (!completeOrderSchemaValidator(req.body)) {
      context.res = badRequestResult(
        'Invalid order completion',
        completeOrderSchemaValidator.errors?.map(
          (error) => error.message ?? ''
        ) ?? []
      );
      return;
    }
    const orderId = context.bindingData.id;
    const orderCompletedBody = req.body as CompleteOrderPartial;
    const updateObject = { ...orderCompletedBody, updatedDate: new Date() };
    const mongooseClient = await MongooseClient.createClassAsync();
    await mongooseClient.updateAsync<Order>(
      OrderModel,
      { _id: orderId },
      updateObject
    );
    context.res = okResult('Order updated');
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
