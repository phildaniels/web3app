import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subscription, tap, timer } from 'rxjs';
import { interval, mergeMap } from 'rxjs';
import {
  ApiResponse,
  ApiResponseBody,
} from '../../models/api-responses.models';
import { CompleteOrderPartial, Order } from '../../models/order';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  error = '';
  subscriptions: Subscription[] = [];
  orders: Order[] = [];
  constructor(
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      timer(0, 60000)
        .pipe(mergeMap(() => this.apiService.getOrders()))
        .subscribe({
          next: (response: ApiResponseBody<Order[]>) =>
            (this.orders = response?.data ?? []),
          error: (error) =>
            (this.error =
              error?.body?.errors?.join(', ') ??
              error?.error?.message ??
              error?.error ??
              error?.message ??
              JSON.stringify(error)),
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  completeOrder(order: Order): void {
    this.loadingService.isLoading = true;
    const payload: CompleteOrderPartial = {
      orderPrice: order.orderPrice,
      orderCompleted: true,
    };
    this.subscriptions.push(
      this.apiService
        .completeOrder(order._id, payload)
        .pipe(finalize(() => (this.loadingService.isLoading = false)))
        .subscribe({
          next: (_: ApiResponseBody<{}>) => {
            const index = this.orders.indexOf(order);
            if (index > -1) {
              this.orders[index].orderCompleted = true;
              this.orders[index].orderPrice = order.orderPrice;
            }
          },
          error: (error) =>
            (this.error =
              error?.body?.errors?.join(', ') ??
              error?.error?.message ??
              error?.error ??
              error?.message ??
              JSON.stringify(error)),
          complete: () => (this.loadingService.isLoading = false),
        })
    );
  }
}
