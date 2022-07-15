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
import axios from 'axios';
import { EventGridEvent } from '../data/event-grid-event.model';
import { OrderCompletedEvent } from '../data/order-completed-event.model';
import * as uuid from 'uuid';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    if (process.env['CurrentEnvironment'] !== 'Production') {
      (process.env['NODE_TLS_REJECT_UNAUTHORIZED'] as any) = 0;
    }
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
    const eventGridEvent = {
      topic:
        '/subscriptions/5b4b650e-28b9-4790-b3ab-ddbd88d727c4/resourcegroups/test/providers/Microsoft.EventHub/namespaces/test',
      subject: 'order',
      eventType: 'completed',
      eventTime: new Date(),
      id: uuid.v4(),
      data: {
        orderId,
      },
      dataVersion: '',
      metadataVersion: '1',
    } as EventGridEvent<OrderCompletedEvent>;
    try {
      await axios.post(
        process.env['EventGridEndpoint'] ?? '',
        [eventGridEvent],
        {
          headers: {
            'Content-Type': 'application/json',
            'aeg-event-type': 'Notification',
            'aeg-sas-key': process.env['EventGridKey'] ?? '',
          },
        }
      );
    } catch (e) {
      context.log.error('EventGrid failed with error', e);
      await mongooseClient.updateAsync<Order>(
        OrderModel,
        { _id: orderId },
        { orderCompleted: false, orderPrice: null }
      );
      throw 'EventGrid failed to send event';
    }

    context.res = okResult('Order updated');
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    context.res = internalServerErrorResult('Something went wrong');
  }
};

export default httpTrigger;
