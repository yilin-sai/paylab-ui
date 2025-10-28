import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError, AxiosInstance } from "axios";

export function useApiClient() {
  const { getToken } = useAuth();

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  });

  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}

export const createApiKey = async (name: string, apiClient: AxiosInstance) => {
  try {
    const response = await apiClient.post("/api-keys", { name });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create API key`, { cause: error as AxiosError });
  }
};

export const getApiKeys = async (apiClient: AxiosInstance) => {
  try {
    const response = await apiClient.get("/api-keys/");
    return response.data;
  } catch {
    throw new Error("Failed to fetch API keys");
  }
};

export const revokeApiKey = async (id: string, apiClient: AxiosInstance) => {
  try {
    await apiClient.delete(`/api-keys/${id}`);
  } catch {
    throw new Error("Failed to revoke API key");
  }
};
