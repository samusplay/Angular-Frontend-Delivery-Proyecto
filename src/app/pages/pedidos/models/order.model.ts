
export type OrderStatus='PENDING'|'CANCELLED'|'APPROVED'|'REJECTED'

export interface OrderItem{
    id?:number
    productId:number
    quantity:number
}

//interfaz con todos los campos posibles
export interface BaseOrder{
    id:number
    orderId:number
    userId:number
    items:OrderItem[]
    status:OrderStatus
    message?:string
}