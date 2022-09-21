import axios from 'axios';
import {
  Opportunity,
  RecentOpportunityResponse,
  SalesForceAccessTokenResponse,
} from '../data/salesforce.models';

export class SalesForceClient {
  private initialized: boolean = false;
  private accessToken: string = '';

  constructor() {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    axios.interceptors.response.use(
      (axiosSuccessResponse) => axiosSuccessResponse,
      async (axiosErrorResponse) => {
        const axiosRequestConfig = axiosErrorResponse.config;
        if (
          axiosErrorResponse.response.status === 401 &&
          axiosRequestConfig.retry !== true
        ) {
          axiosRequestConfig.retry = true;
          this.accessToken = await this.getAccessToken();
          axios.defaults.headers[
            'Authorization'
          ] = `Bearer ${this.accessToken}`;
          axiosRequestConfig.headers[
            'Authorization'
          ] = `Bearer ${this.accessToken}`;
          return axios.request(axiosRequestConfig);
        }
        return Promise.reject(axiosErrorResponse);
      }
    );
  }

  async getUpdateOpportunityIdsInRange(
    startDate: Date,
    endDate: Date
  ): Promise<string[]> {
    try {
      const salesForceBaseUrl = process.env['SalesForceBaseUrl'] ?? '';
      const startString = this.formatDateForSalesForceConsumption(startDate);
      const endString = this.formatDateForSalesForceConsumption(endDate);
      const axiosRepsonse = await axios.get<RecentOpportunityResponse>(
        `${salesForceBaseUrl}/sobjects/opportunity/updated?start=${startString}&end=${endString}`
      );
      return axiosRepsonse?.data?.ids ?? [];
    } catch (e) {
      return [];
    }
  }

  async getOpportunity(opportunityId: string): Promise<Opportunity | null> {
    try {
      const salesForceBaseUrl = process.env['SalesForceBaseUrl'] ?? '';
      const axiosRepsonse = await axios.get<Opportunity>(
        `${salesForceBaseUrl}/sobjects/opportunity/${opportunityId}`
      );
      return axiosRepsonse?.data;
    } catch (e) {
      return null;
    }
  }

  private formatDateForSalesForceConsumption(date: Date): string {
    const yyyy = `${date.getFullYear()}`;
    const mm =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    const dd = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const HH =
      date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    const MM =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const SS =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    const formattedString = `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}+00:00`;
    const encodedString = encodeURIComponent(formattedString);
    return encodedString;
  }

  async getAccessToken(): Promise<string> {
    const accessTokenUrl = process.env['SalesForceAccessTokenUrl'] ?? '';
    const grant_type = 'password';
    const client_id = process.env['SalesForceClientId'];
    const client_secret = process.env['SalesForceClientSecret'];
    const username = process.env['SalesForceUserName'];
    const password = process.env['SalesForcePassword'];
    var querystring = require('querystring');
    try {
      const response = await axios.post<SalesForceAccessTokenResponse>(
        accessTokenUrl,
        querystring.stringify({
          grant_type,
          client_id,
          client_secret,
          username,
          password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token;
    } catch (e) {
      return '';
    }
  }

  static async createClassAsync(): Promise<SalesForceClient> {
    const client = new SalesForceClient();
    await client.initialize();
    return client;
  }
}
