import { model, Schema } from 'mongoose';
import Ajv, { JSONSchemaType } from 'ajv';

export interface CreateOrderPartial {
  orderName: string;
  orderDescription: string;
  clientUniqueId: string;
}

export interface CompleteOrderPartial {
  orderPrice: number | null;
  orderCompleted: boolean;
}

export interface OrderBlockChainDataPartial {
  contentIdentifier: string | null;
}

export interface OrderPartial
  extends CreateOrderPartial,
    CompleteOrderPartial {}

export interface AuditInfo {
  createdOn: Date;
  updatedOn: Date;
}

export interface Order
  extends OrderPartial,
    CompleteOrderPartial,
    OrderBlockChainDataPartial,
    AuditInfo {}

export const OrderModel = model<Order>(
  'Order',
  new Schema<Order>({
    orderName: { type: String, required: true },
    orderPrice: { type: Number, required: false },
    orderDescription: { type: String, required: true },
    clientUniqueId: { type: String, required: true },
    orderCompleted: { type: Boolean, required: true },
    contentIdentifier: { type: String, required: false },
    createdOn: { type: Date, required: true },
    updatedOn: { type: Date, required: true },
  })
);

export const OrderSchema: JSONSchemaType<OrderPartial> = {
  type: 'object',
  properties: {
    orderName: { type: 'string' },
    orderPrice: { type: 'number' },
    orderDescription: { type: 'string' },
    clientUniqueId: { type: 'string' },
    orderCompleted: { type: 'boolean' },
  },
  required: ['orderName', 'orderDescription', 'clientUniqueId'],
  additionalProperties: false,
};

export const CompleteOrderSchema: JSONSchemaType<CompleteOrderPartial> = {
  type: 'object',
  properties: {
    orderPrice: { type: 'number' },
    orderCompleted: { type: 'boolean' },
  },
  required: ['orderPrice', 'orderCompleted'],
  additionalProperties: false,
};

export const orderSchemaValidator = new Ajv().compile(OrderSchema);

export const completeOrderSchemaValidator = new Ajv().compile(
  CompleteOrderSchema
);
