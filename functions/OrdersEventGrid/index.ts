import { AzureFunction, Context } from '@azure/functions';
import { EventGridEvent } from '../data/event-grid-event.model';
import { OrderCompletedEvent } from '../data/order-completed-event.model';
import axios from 'axios';
import { ApiResponse } from '../data/api-responses.models';
import { Order, OrderModel } from '../data/order';
const pinataSdk = require('@pinata/sdk');
import { Readable } from 'stream';
import * as fs from 'fs';
import * as fs$ from 'fs/promises';
import * as tmp from 'tmp';
import { MongooseClient } from '../clients/mongoose.client';

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: EventGridEvent<OrderCompletedEvent>
): Promise<void> {
  try {
    context.log(
      `Orders function received event ${JSON.stringify(eventGridEvent)}`
    );

    const orderId = eventGridEvent.data.orderId;
    const order = await axios.get<ApiResponse<Order>>(
      `${process.env['OrdersApiBaseUrl']}/orders/${orderId}`,
      {
        headers: {
          'x-functions-key': process.env['OrdersApiKey'] ?? '',
        },
      }
    );
    context.log(`Orders function received order ${JSON.stringify(order.data)}`);
    const fileName = `${orderId}.txt`;
    const filePath = tmp.fileSync({
      prefix: fileName,
      postfix: '.txt',
    });
    await fs$.writeFile(
      filePath.name,
      `UL Mark for identifier ${orderId}_${
        order.data.body?.data?.clientUniqueId ?? ''
      }`
    );

    const stream = fs.createReadStream(filePath.name);

    const pinataClient = pinataSdk(
      process.env['PinataApiKey'] ?? '',
      process.env['PinataSecretApiKey'] ?? ''
    );
    const pinataResponse = await pinataClient.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });
    context.log(
      `Orders function pinned file ${JSON.stringify(pinataResponse)}`
    );
    const mongooseClient = await MongooseClient.createClassAsync();
    await mongooseClient.updateAsync<Order>(
      OrderModel,
      { _id: orderId },
      { contentIdentifier: pinataResponse.IpfsHash }
    );
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    throw e;
  }
};

export default eventGridTrigger;
