import { BaseOrder } from "./order.model";
//traemos todo del modelo 
export type OrderResponseDTO=Omit<BaseOrder,'id'>