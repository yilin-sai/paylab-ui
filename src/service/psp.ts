import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
export const pspApi = axios.create({
  baseURL: `${base}/psp`,
});

export const getPsps = async () => {
  try {
    const response = await pspApi.get("/webhooks/psps");
    return response.data;
  } catch {
    throw new Error("Failed to fetch PSPs");
  }
};

export const createWebhook = async (
  url: string,
  events: string[],
  psp: string,
  pspSpecificConfigs?: object
) => {
  const [pspName, pspVersion] = psp.split("@");
  try {
    const response = await pspApi.post("/webhooks/", [
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
  } catch {
    throw new Error("Failed to create webhook");
  }
};

export const getWebhooks = async () => {
  try {
    const response = await pspApi.get("/webhooks/");
    return response.data;
  } catch {
    throw new Error("Failed to fetch webhooks");
  }
};

export const removeWebhook = async (id: string) => {
  try {
    await pspApi.delete(`/webhooks/${id}`);
  } catch {
    throw new Error("Failed to delete webhook");
  }
};

export const getWebhookHistory = async (id: string) => {
  try {
    const response = await pspApi.get(`/webhooks/${id}/deliveries`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch webhook history");
  }
};
