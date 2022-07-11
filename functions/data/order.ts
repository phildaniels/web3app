import { model, Schema } from 'mongoose';
import Ajv, { JSONSchemaType } from 'ajv';

export interface IOrder {
  orderName: string;
  price: number;
}

export const Order = model<IOrder>(
  'Order',
  new Schema<IOrder>({
    orderName: { type: String, required: true },
    price: { type: Number, required: true },
  })
);

export const OrderSchema: JSONSchemaType<IOrder> = {
  type: 'object',
  properties: {
    orderName: { type: 'string' },
    price: { type: 'number' },
  },
  required: ['orderName', 'price'],
  additionalProperties: false,
};

export const orderSchemaValidator = new Ajv().compile(OrderSchema);
