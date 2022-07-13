export interface CreateOrderPartial {
  orderName: string;
  orderDescription: string;
  clientUniqueId: string;
}

export interface CompleteOrderPartial {
  orderPrice: number | null;
  orderCompleted: boolean;
}

export interface OrderPartial
  extends CreateOrderPartial,
    CompleteOrderPartial {}

export interface AuditInfo {
  createdOn: Date;
  updatedOn: Date;
}

export interface Order extends OrderPartial, AuditInfo {
  _id: string;
}
