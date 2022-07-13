import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription, tap } from 'rxjs';
import {
  notOnlyWhiteSpaceValidator,
  stringIsValidInput,
} from '../../../utilities/functions';
import {
  ApiResponse,
  ApiResponseBody,
} from '../../models/api-responses.models';
import { Order, OrderPartial } from '../../models/order';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
})
export class PlaceOrderComponent implements OnInit, OnDestroy {
  fileNames: string[] = [];
  error = '';
  subscriptions: Subscription[] = [];
  placeOrderForm = new FormGroup({
    orderName: new FormControl('', {
      validators: [Validators.required, notOnlyWhiteSpaceValidator()],
    }),
    orderDescription: new FormControl('', {
      validators: [Validators.required, notOnlyWhiteSpaceValidator()],
    }),
    clientUniqueId: new FormControl('', {
      validators: [Validators.required, notOnlyWhiteSpaceValidator()],
    }),
  });
  constructor(
    private apiService: ApiService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onFileSelected(): void {
    const inputNode: any = document.querySelector('#file');
    const fileList = inputNode?.files != null ? [...inputNode.files] : [];
    this.fileNames = fileList.map((file: { name: any }) => file?.name);
  }

  getErrorMessage(control: FormControl): string {
    return control.hasError('required')
      ? 'You must enter a value'
      : control.hasError('onlyWhiteSpace')
      ? 'Value must not be only white space'
      : '';
  }

  onSubmit(): void {
    if (!this.placeOrderForm.valid) {
      return;
    }
    const formValue = this.placeOrderForm.value;
    if (
      !(
        formValue.clientUniqueId != null &&
        formValue.orderDescription != null &&
        formValue.orderName != null
      )
    ) {
      return;
    }
    const orderPartial = formValue as OrderPartial;
    this.error = '';
    this.loadingService.isLoading = true;
    this.subscriptions.push(
      this.apiService
        .createOrder(orderPartial)
        .pipe(finalize(() => (this.loadingService.isLoading = false)))
        .subscribe({
          next: (response: ApiResponseBody<Order>) => {
            const ref = this.snackBar.open(
              `Order ${response.data?._id} created`,
              'Copy'
            );
            this.subscriptions.push(
              ref.onAction().subscribe(async () => {
                try {
                  await navigator.clipboard.writeText(
                    response?.data?._id ?? 'could not copy'
                  );
                } catch (error) {
                  alert('Could not copy to clipboard');
                }
              })
            );
          },
          error: (error) =>
            (this.error =
              error?.errors?.join(', ') ??
              error?.error?.message ??
              error?.error ??
              error?.message ??
              JSON.stringify(error)),
          complete: () => {
            this.loadingService.isLoading = false;
            this.placeOrderForm.reset();
            Object.values(this.placeOrderForm.controls).forEach((control) => {
              control.markAsPristine();
              control.markAsUntouched();
              control.setErrors(null);
            });
          },
        })
    );
  }
}
