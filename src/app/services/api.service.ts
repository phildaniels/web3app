import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseBody } from '../models/api-responses.models';
import { CompleteOrderPartial, Order, OrderPartial } from '../models/order';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  createOrder(orderPartial: OrderPartial): Observable<ApiResponseBody<Order>> {
    return this.httpClient.post<ApiResponseBody<Order>>(
      `${environment.apiUrl}/orders`,
      orderPartial
    );
  }

  getOrders(): Observable<ApiResponseBody<Order[]>> {
    return this.httpClient.get<ApiResponseBody<Order[]>>(
      `${this.apiUrl}/orders`
    );
  }

  getOrderByOrderId(orderId: string): Observable<ApiResponseBody<Order>> {
    return this.httpClient.get<ApiResponseBody<Order>>(
      `${this.apiUrl}/orders/${orderId}`
    );
  }

  getOrdersByClientUniqueId(
    clientUniqueId: string
  ): Observable<ApiResponseBody<Order[]>> {
    return this.httpClient.get<ApiResponseBody<Order[]>>(
      `${this.apiUrl}/client/${clientUniqueId}/orders`
    );
  }

  completeOrder(
    orderId: string,
    completionDetails: CompleteOrderPartial
  ): Observable<ApiResponseBody<{}>> {
    return this.httpClient.patch<ApiResponseBody<{}>>(
      `${this.apiUrl}/orders/${orderId}/complete`,
      completionDetails
    );
  }
}
