import { BaseOrder } from "./order.model";

//extraemos las propiedades necesarios
export type CreateOrderRequestDto=Pick<BaseOrder,'items'>