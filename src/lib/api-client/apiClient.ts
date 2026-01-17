import {
  AuthCredentials,
  AuthResponseData,
  ValidateResponseData,
} from './types/auth';
import { Resource } from '@/components/resources-display/types/resource';

import { fetcher } from './helpers/request';

import {
  CreateCollectionRequest,
  CreatePinRequest,
  CreatePinResourceRequest,
} from './types/request';
import { CreateMuralRequest, MuralRequest } from './types/request';
import {
  FetcherResponse,
  GetResourcesResponseData,
  MuralResponseData,
} from './types/response';
import { Pagination } from '@/lib/types/pagination';
import { PaymentPeriod } from '@/app/(marketing)/checkout/[period]/page';

export const apiClient = {
  auth: {
    login: async (
      credentials: AuthCredentials,
    ): Promise<FetcherResponse<AuthResponseData>> => {
      return await fetcher('/auth/login', {
        method: 'POST',
        body: credentials,
      });
    },

    signup: async (
      credentials: AuthCredentials,
    ): Promise<FetcherResponse<AuthResponseData>> => {
      return await fetcher('/auth/register', {
        method: 'POST',
        body: credentials,
      });
    },

    validateToken: async (): Promise<FetcherResponse<ValidateResponseData>> => {
      const token = localStorage.getItem('token');

      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'No token found',
        };
      }

      return await fetcher<ValidateResponseData>('/auth/validate', {
        method: 'GET',
        token,
      });
    },
  },
  collection: {
    getAll: async (muralId: string) => {
      const token = localStorage.getItem('token');

      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'Authentication required',
        };
      }

      return await fetcher(`/collections/get-all/${muralId}`, {
        method: 'GET',
        token,
      });
    },
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
    get: async (
      mural: MuralRequest,
    ): Promise<FetcherResponse<MuralResponseData>> => {
      const queryParams: Record<string, boolean> = {};

      if (mural.getMainCollectionResources) {
        queryParams.getMainCollectionResources = true;
      }

      return await fetcher<MuralResponseData>(`/murals/${mural.muralName}`, {
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
  resources: {
    createPinResource: async (
      collectionId: string,
      request: CreatePinResourceRequest,
    ): Promise<FetcherResponse> => {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          error: 'unauthorized',
          message: 'Authentication required',
        };
      }

      return await fetcher(`/resources/create/pin/${collectionId}`, {
        method: 'POST',
        body: request,
        token: token,
      });
    },
    getResources: async (
      collectionId: string,
      page: number = 1,
      limit: number = 5,
    ): Promise<FetcherResponse<GetResourcesResponseData>> => {
      return await fetcher<{
        pinnedResources: {
          id: string;
          order: number;
          resource: Resource;
        }[];
        resources: Resource[];
        pagination: Pagination;
      }>(`/resources/collection/${collectionId}`, {
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
  storage: {
    getPresignedUrl: async (
      fileName: string,
      mimeType: string,
      fileSize: number,
      context:
        | 'profile-image'
        | 'cover-image'
        | 'pin-image'
        | 'pin-video'
        | 'pin-file',
    ): Promise<
      FetcherResponse<{
        uploadUrl: string;
        publicUrl: string;
        fileKey: string;
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

      return await fetcher('/storage/presign', {
        method: 'POST',
        body: {
          fileName,
          mimeType,
          fileSize,
          context,
        },
        token,
      });
    },

    uploadToPresignedUrl: async (
      uploadUrl: string,
      file: File,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!response.ok) {
          return {
            success: false,
            error: `Upload failed: ${response.status} ${response.statusText}`,
          };
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Upload failed',
        };
      }
    },

    uploadImage: async (
      file: File,
    ): Promise<
      FetcherResponse<{
        publicUrl: string;
        fileKey: string;
      }>
    > => {
      // Step 1: Get presigned URL
      const presignResult = await apiClient.storage.getPresignedUrl(
        file.name,
        file.type,
        file.size,
        'pin-image',
      );

      if (!presignResult.success) {
        return presignResult;
      }

      // Step 2: Upload to presigned URL
      const uploadResult = await apiClient.storage.uploadToPresignedUrl(
        presignResult.data.uploadUrl,
        file,
      );

      if (!uploadResult.success) {
        return {
          success: false,
          error: 'upload-error',
          message: uploadResult.error || 'Upload to storage failed',
        };
      }

      // Step 3: Return public URL and file key
      return {
        success: true,
        data: {
          publicUrl: presignResult.data.publicUrl,
          fileKey: presignResult.data.fileKey,
        },
      };
    },

    uploadVideo: async (
      file: File,
    ): Promise<
      FetcherResponse<{
        publicUrl: string;
        fileKey: string;
      }>
    > => {
      const presignResult = await apiClient.storage.getPresignedUrl(
        file.name,
        file.type,
        file.size,
        'pin-video',
      );

      if (!presignResult.success) {
        return presignResult;
      }

      const uploadResult = await apiClient.storage.uploadToPresignedUrl(
        presignResult.data.uploadUrl,
        file,
      );

      if (!uploadResult.success) {
        return {
          success: false,
          error: 'upload-error',
          message: uploadResult.error || 'Upload to storage failed',
        };
      }

      return {
        success: true,
        data: {
          publicUrl: presignResult.data.publicUrl,
          fileKey: presignResult.data.fileKey,
        },
      };
    },

    uploadFile: async (
      file: File,
    ): Promise<
      FetcherResponse<{
        publicUrl: string;
        fileKey: string;
        fileName: string;
        fileSize: number;
      }>
    > => {
      const presignResult = await apiClient.storage.getPresignedUrl(
        file.name,
        file.type,
        file.size,
        'pin-file',
      );

      if (!presignResult.success) {
        return presignResult;
      }

      const uploadResult = await apiClient.storage.uploadToPresignedUrl(
        presignResult.data.uploadUrl,
        file,
      );

      if (!uploadResult.success) {
        return {
          success: false,
          error: 'upload-error',
          message: uploadResult.error || 'Upload to storage failed',
        };
      }

      return {
        success: true,
        data: {
          publicUrl: presignResult.data.publicUrl,
          fileKey: presignResult.data.fileKey,
          fileName: file.name,
          fileSize: file.size,
        },
      };
    },
  },
};
