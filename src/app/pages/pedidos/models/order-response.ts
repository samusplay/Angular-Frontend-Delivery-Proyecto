import { BaseOrder } from "./order.model";

export type OrderResponse = Omit<BaseOrder, 'orderId' | 'message'>;