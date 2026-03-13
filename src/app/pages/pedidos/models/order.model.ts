
export type OrderStatus='PENDING'|'CANCELLED'|'APPROVED'|'REJECTED'

//interfaz con todos los campos posibles
export interface BaseOrder{
    id:number
    orderId:number
    userId:number
    productId:number
    quantity:number
    status:OrderStatus
    message?:string
}