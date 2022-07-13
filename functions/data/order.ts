import { model, Schema } from 'mongoose';
import Ajv, { JSONSchemaType } from 'ajv';

export interface IOrder {
  orderName: string;
  price: number;
  orderDescription: string;
  clientUniqueId: string;
  orderCompleted: boolean;
}

export const Order = model<IOrder>(
  'Order',
  new Schema<IOrder>({
    orderName: { type: String, required: true },
    price: { type: Number, required: true },
    orderDescription: { type: String, required: true },
    clientUniqueId: { type: String, required: true },
    orderCompleted: { type: Boolean, required: true },
  })
);

export const OrderSchema: JSONSchemaType<IOrder> = {
  type: 'object',
  properties: {
    orderName: { type: 'string' },
    price: { type: 'number' },
    orderDescription: { type: 'string' },
    clientUniqueId: { type: 'string' },
    orderCompleted: { type: 'boolean' },
  },
  required: [
    'orderName',
    'price',
    'orderDescription',
    'clientUniqueId',
    'orderCompleted',
  ],
  additionalProperties: false,
};

export const orderSchemaValidator = new Ajv().compile(OrderSchema);
