import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { CreateOrderRequestDto } from '../models/create.order.request.dto';
import { OrderResponse } from '../models/order-response';
import { OrderResponseDTO } from '../models/order-response.dto';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private endpoint = 'api/orders'

  constructor(private readonly backend: BackendService) { }

  //crear orden
  createOrder(request: CreateOrderRequestDto): Observable<OrderResponseDTO> {
    const path = `${this.endpoint}/crear`;
    return this.backend.post<OrderResponseDTO>(path, request);
  }
  //listar ordenes por usuario
  getOrdersByUserId(userId: number): Observable<OrderResponse[]> {
    const path = `${this.endpoint}/user/${userId}`;
    return this.backend.get<OrderResponse[]>(path);
  }

  //cancelar orden
  cancelOrder(orderId: number): Observable<OrderResponseDTO> {
    const path = `${this.endpoint}/cancelar/${orderId}`;
    return this.backend.post<OrderResponseDTO>(path, {});
  }



}
