import axios, { AxiosError } from "axios";

axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const createApiKey = async (name: string) => {
  try {
    const response = await axios.post("/api-keys", { name });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create API key`, { cause: error as AxiosError });
  }
};

export const getApiKeys = async () => {
  try {
    const response = await axios.get("/api-keys/");
    return response.data;
  } catch {
    throw new Error("Failed to fetch API keys");
  }
};

export const revokeApiKey = async (id: string) => {
  try {
    await axios.delete(`/api-keys/${id}`);
  } catch {
    throw new Error("Failed to revoke API key");
  }
};
