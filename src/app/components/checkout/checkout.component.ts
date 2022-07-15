import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ethers } from 'ethers';
import { lastValueFrom, Subscription } from 'rxjs';
import { Order } from '../../models/order';
import { ApiService } from '../../services/api.service';
import ULMark from '../../../artifacts/contracts/ULMark.sol/ULMark.json';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  env = environment;
  error = '';
  subscriptions: Subscription[] = [];
  order?: (Order & { isContentOwned: boolean }) | null = null;
  orderId: string | null = '';
  balance: string = '';
  totalMinted = 0;
  contract: ethers.Contract | null = null;
  signer: any;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe(async (params) => {
        const newOrderId = params.get('id');
        if (newOrderId !== this.orderId && this.orderId != null) {
          this.orderId = newOrderId;
          try {
            const ethereum = (window as any).ethereum;
            const [account] = await ethereum.request({
              method: 'eth_requestAccounts',
            });
            const provider = new ethers.providers.Web3Provider(ethereum);
            const balance = await provider.getBalance(account);
            this.balance = ethers.utils.formatEther(balance);

            const contractAddress = this.env.contractAddress;
            this.signer = provider.getSigner();
            this.contract = new ethers.Contract(
              contractAddress,
              ULMark.abi,
              this.signer
            );
            this.subscriptions.push(
              this.apiService.getOrderByOrderId(this.orderId ?? '').subscribe({
                next: async (response) => {
                  if (!response.data) {
                    return;
                  }
                  if (!this.contract) {
                    return;
                  }
                  const isContentOwned = await this.contract.isContentOwned(
                    response.data.contentIdentifier
                  );
                  this.order = { ...response?.data, isContentOwned };
                },
                error: (error) =>
                  (this.error =
                    error?.body?.errors?.join(', ') ??
                    error?.error?.message ??
                    error?.error ??
                    error?.message ??
                    JSON.stringify(error)),
              })
            );
          } catch (error) {
            console.error(error);
            this.orderId = '';
            this.balance = '';
            this.order = null;
            this.totalMinted = 0;
          }
        }
      })
    );
  }

  async checkout(): Promise<void> {
    try {
      if (
        !this.order ||
        this.order.isContentOwned ||
        !this.contract ||
        !this.signer
      ) {
        return;
      }
      const connection = this.contract.connect(this.signer);
      const addr = connection.address;
      const result = await this.contract.payToMint(
        addr,
        this.order.contentIdentifier,
        {
          value: ethers.utils.parseEther(
            this.order.orderPrice?.toString() ?? '0.05'
          ),
        }
      );
      this.router.navigate(['pay']);
    } catch (e) {
      console.error(e);
    }
  }
}
