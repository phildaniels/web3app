import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  mergeMap,
  concatMap,
  finalize,
  of,
  Subscription,
} from 'rxjs';
import { Order } from '../../models/order';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { ethers } from 'ethers';
import ULMark from '../../../artifacts/contracts/ULMark.sol/ULMark.json';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit, OnDestroy {
  env = environment;
  private subscriptions: Subscription[] = [];
  orders: (Order & { isContentOwned: boolean })[] = [];
  error = '';
  constructor(
    private router: Router,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const ethereum = (window as any).ethereum;
      const [account] = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contractAddress = this.env.contractAddress;
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ULMark.abi, signer);
      this.loadingService.isLoading = true;
      this.subscriptions.push(
        this.apiService.getOrdersByClientUniqueId(account).subscribe({
          next: (response) => {
            const orders = response?.data ?? [];
            orders.forEach(async (order) => {
              if (order.contentIdentifier == null) {
                this.orders.push({ ...order, isContentOwned: false });
              } else {
                const isContentOwned = (await contract.isContentOwned(
                  order.contentIdentifier
                )) as boolean;
                debugger;
                this.orders.push({ ...order, isContentOwned });
              }
            });
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
    } catch (e) {
      console.error(e);
    }
  }

  async copyToClipBoard(value: string): Promise<void> {
    if (value == null) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      alert('Could not copy to clipboard');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  goToPayment(order: Order): void {
    this.router.navigate(['pay', order._id]);
  }
}
