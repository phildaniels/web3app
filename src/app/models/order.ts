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

export interface OrderBlockChainDataPartial {
  contentIdentifier: string | null;
}

export interface AuditInfo {
  createdOn: Date;
  updatedOn: Date;
}

export interface Order
  extends OrderPartial,
    OrderBlockChainDataPartial,
    AuditInfo {
  _id: string;
}
