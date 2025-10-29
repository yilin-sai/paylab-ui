import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError, AxiosInstance } from "axios";

export function usePspApiClient() {
  const { getToken } = useAuth();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const client = axios.create({
    baseURL: `${base}/psp`,
  });

  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}

export const getPsps = async (apiClient: AxiosInstance) => {
  try {
    const response = await apiClient.get("/webhooks/psps");
    return response.data;
  } catch {
    throw new Error("Failed to fetch PSPs");
  }
};

export const createWebhook = async (
  url: string,
  events: string[],
  psp: string,
  apiClient: AxiosInstance,
  pspSpecificConfigs?: object
) => {
  const [pspName, pspVersion] = psp.split("@");
  try {
    const response = await apiClient.post("/webhooks/", [
      {
        psp: pspName,
        pspVersion,
        url,
        eventTypes: events,
        enabled: true,
        pspSpecificConfigs,
      },
    ]);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create webhook", { cause: error as AxiosError });
  }
};

export const getWebhooks = async (apiClient: AxiosInstance) => {
  try {
    const response = await apiClient.get("/webhooks/");
    return response.data;
  } catch {
    throw new Error("Failed to fetch webhooks");
  }
};

export const removeWebhook = async (id: string, apiClient: AxiosInstance) => {
  try {
    await apiClient.delete(`/webhooks/${id}`);
  } catch {
    throw new Error("Failed to delete webhook");
  }
};

export const getWebhookHistory = async (
  id: string,
  apiClient: AxiosInstance
) => {
  try {
    const response = await apiClient.get(`/webhooks/${id}/deliveries`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch webhook history");
  }
};
