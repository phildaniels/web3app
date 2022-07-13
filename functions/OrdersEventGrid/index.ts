import { AzureFunction, Context } from '@azure/functions';
import { EventGridEvent } from '../data/event-grid-event.model';
import { OrderCompletedEvent } from '../data/order-completed-event.model';

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: EventGridEvent<OrderCompletedEvent>
): Promise<void> {
  try {
  } catch (e) {
    context.log.error('Orders function failed with error', e);
    throw e;
  }
};

export default eventGridTrigger;
