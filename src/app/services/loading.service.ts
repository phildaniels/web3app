import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: boolean = false;
  constructor() {}

  public get isLoading(): boolean {
    return this.loading;
  }

  public set isLoading(value: boolean) {
    this.loading = value;
  }
}
