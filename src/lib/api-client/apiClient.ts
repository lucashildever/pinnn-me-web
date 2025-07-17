import { AuthCredentials } from "./types/auth";

import { fetcher } from "./helpers/request";

import { CreateCollectionRequest, CreatePinRequest } from "./types/request";
import { CreateMuralRequest, MuralRequest } from "./types/request";
import { FetcherResponse, FetchError } from "./types/response";

export const apiClient = {
  auth: {
    login: async (credentials: AuthCredentials): Promise<FetcherResponse> => {
      return await fetcher("/auth/login", {
        method: "POST",
        body: credentials,
      });
    },

    signup: async (credentials: AuthCredentials): Promise<FetcherResponse> => {
      return await fetcher("/auth/register", {
        method: "POST",
        body: credentials,
      });
    },
  },
  collection: {
    create: async (collection: CreateCollectionRequest) => {
      return await fetcher(`collections/create/${collection.muralId}`, {
        method: "POST",
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
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          error: FetchError.UNAUTHORIZED,
          message: "Authentication required",
        };
      }

      return await fetcher("/murals/create", {
        method: "POST",
        body: mural,
        token: token,
      });
    },
  },
  pins: {
    create: async (
      collectionId: string,
      pin: CreatePinRequest
    ): Promise<FetcherResponse> => {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: FetchError.UNAUTHORIZED,
          message: "Authentication required",
        };
      }

      return await fetcher(`/pins/create/${collectionId}`, {
        method: "POST",
        body: pin,
        token: token,
      });
    },
    getPaginated: async (
      collectionId: string,
      page: number = 1,
      limit: number = 5
    ): Promise<FetcherResponse> => {
      return await fetcher(`/pins/paginated/${collectionId}`, {
        method: "GET",
        queryParams: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });
    },
  },
};
