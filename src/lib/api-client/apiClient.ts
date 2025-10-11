import { AuthCredentials } from './types/auth';

import { fetcher } from './helpers/request';

import { CreateCollectionRequest, CreatePinRequest } from './types/request';
import { CreateMuralRequest, MuralRequest } from './types/request';
import { FetcherResponse } from './types/response';
import { PaymentPeriod } from '@/app/(marketing)/checkout/[period]/page';

export const apiClient = {
  auth: {
    login: async (credentials: AuthCredentials): Promise<FetcherResponse> => {
      return await fetcher('/auth/login', {
        method: 'POST',
        body: credentials,
      });
    },

    signup: async (credentials: AuthCredentials): Promise<FetcherResponse> => {
      return await fetcher('/auth/register', {
        method: 'POST',
        body: credentials,
      });
    },
  },
  collection: {
    create: async (collection: CreateCollectionRequest) => {
      return await fetcher(`collections/create/${collection.muralId}`, {
        method: 'POST',
        body: {
          isMain: collection.isMain,
          displayElement: collection.displayElement,
        },
      });
    },
  },
  mural: {
    get: async (mural: MuralRequest): Promise<FetcherResponse> => {
      const queryParams: Record<string, boolean> = {};

      if (mural.getMainCollectionPins) {
        queryParams.getMainCollectionPins = true;
      }

      return await fetcher<FetcherResponse>(`/murals/${mural.muralName}`, {
        queryParams,
      });
    },
    create: async (mural: CreateMuralRequest): Promise<FetcherResponse> => {
      const token = localStorage.getItem('token');

      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'Authentication required',
        };
      }

      return await fetcher('/murals/create', {
        method: 'POST',
        body: mural,
        token: token,
      });
    },
  },
  pins: {
    create: async (
      collectionId: string,
      pin: CreatePinRequest,
    ): Promise<FetcherResponse> => {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'Authentication required',
        };
      }

      return await fetcher(`/pins/create/${collectionId}`, {
        method: 'POST',
        body: pin,
        token: token,
      });
    },
    getPaginated: async (
      collectionId: string,
      page: number = 1,
      limit: number = 5,
    ): Promise<FetcherResponse> => {
      return await fetcher(`/pins/paginated/${collectionId}`, {
        method: 'GET',
        queryParams: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });
    },
  },
  stripe: {
    fetchClientSecret: async (
      planType: 'pro',
      period: PaymentPeriod,
    ): Promise<
      FetcherResponse<{
        sessionId: string;
        clientSecret: string;
        url: string;
      }>
    > => {
      const token = localStorage.getItem('token');

      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'Authentication required',
        };
      }

      return await fetcher<{
        sessionId: string;
        clientSecret: string;
        url: string;
      }>('/payments/create-checkout-session', {
        method: 'POST',
        body: {
          planType: planType,
          period: period,
        },
        token: token,
      });
    },

    getSessionStatus: async (
      sessionId: string,
    ): Promise<
      FetcherResponse<{
        status: string;
        payment_status: string;
        customer_email?: string;
        amount_total: number;
        currency: string;
      }>
    > => {
      const token = localStorage.getItem('token');

      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'Authentication required',
        };
      }

      return await fetcher(`/payments/session-status?session_id=${sessionId}`, {
        method: 'GET',
        token: token,
      });
    },
  },
};
