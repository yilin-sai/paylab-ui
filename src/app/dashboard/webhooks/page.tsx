"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  App,
} from "antd";
import { CONTENT_MARGIN, SIDER_WIDTH } from "../layout";
import {
  createWebhook,
  getPsps,
  getWebhooks,
  removeWebhook,
  usePspApiClient,
} from "@/service/psp";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useUser } from "@clerk/nextjs";

const { Title } = Typography;
const { Option } = Select;

type Webhook = {
  webhookSubscriptionId: string;
  psp: string;
  pspVersion: string;
  url: string;
  transactionEventTypes: string[];
  enabled: boolean;
};

const allEventTypes = [
  "payment_initiated",
  "payment_authorising",
  "payment_authorised",
  "payment_declined",
  "payment_capturing",
  "payment_expired",
  "payment_captured",
  "payment_capture_failed",

  "payment_intent_requires_payment",
  "payment_intent_processing",
  "payment_intent_succeeded",
  "payment_intent_failed",
];

type WebhookFormValues = {
  psp: string;
  url: string;
  events: string[];
};

interface ConfigField {
  name: string;
  label: string;
  type: "text" | "number" | "checkbox" | "select";
  required: boolean;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<WebhookFormValues>();
  const selectedPsp = Form.useWatch("psp", form);
  const router = useRouter();
  const { message } = App.useApp();
  const [modalLoading, setModalLoading] = useState(false);
  const [psps, setPsps] = useState<{
    [psp: string]: {
      [version: string]: {
        eventMap: { [coreEvent: string]: string };
        configSchema: ConfigField[];
      };
    };
  }>({});
  const apiClient = usePspApiClient();
  const { isSignedIn } = useUser();

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWebhooks(apiClient);
      setWebhooks(res);
    } catch {
      message.error("Failed to load webhooks");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const addWebhook = async (values: WebhookFormValues) => {
    try {
      setModalLoading(true);
      const { url, events, psp, ...pspSpecificConfigs } = values;
      await createWebhook(url, events, psp, apiClient, pspSpecificConfigs);
      message.success("Webhook created");
      setModalOpen(false);
      form.resetFields();
      fetchWebhooks();
    } catch (error) {
      if (((error as Error).cause as AxiosError)?.response?.status === 429) {
        if (isSignedIn) {
          message.error("You have reached the maximum number of webhooks.");
        } else {
          message.error(
            "Anonymous user can only have 1 webhook. Sign in to create more."
          );
        }
      } else {
        message.error("Failed to create webhook");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      await removeWebhook(id, apiClient);
      message.success("Webhook deleted");
      fetchWebhooks();
    } catch {
      message.error("Failed to delete webhook");
    }
  };

  const fetchPsps = async () => {
    try {
      const res = await getPsps(apiClient);
      setPsps(res);
    } catch {
      message.error("Failed to load PSPs");
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  return (
    <div
      style={{
        width: `calc(100vw - ${SIDER_WIDTH}px - ${CONTENT_MARGIN * 2}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Webhooks
        </Title>
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            fetchPsps();
          }}
        >
          Add Webhook
        </Button>
      </div>

      <Table
        rowKey="webhookSubscriptionId"
        dataSource={webhooks}
        loading={loading}
        columns={[
          { title: "ID", dataIndex: "webhookSubscriptionId" },
          {
            title: "PSP",
            render: (_, record) => `${record.psp} @ ${record.pspVersion}`,
          },
          { title: "URL", dataIndex: "url" },
          {
            title: "Events",
            dataIndex: "eventTypes",
            render: (events: string[]) => events.join(", "),
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/webhooks/${record.webhookSubscriptionId}/history`
                    )
                  }
                >
                  View Deliveries
                </Button>
                <Button
                  danger
                  onClick={() => deleteWebhook(record.webhookSubscriptionId)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="Add Webhook"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={modalLoading}
      >
        <Form form={form} layout="vertical" onFinish={addWebhook}>
          <Form.Item name="psp" label="PSP" rules={[{ required: true }]}>
            <Select placeholder="Select a PSP">
              {psps &&
                toPspLabels(psps).map(({ label, value }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="url"
            label="Webhook URL"
            rules={[{ required: true, message: "Please enter a webhook URL" }]}
          >
            <Input placeholder="https://example.com/webhook" />
          </Form.Item>
          <Form.Item
            name="events"
            label="Event Types"
            rules={[
              { required: true, message: "Please select at least one event" },
            ]}
          >
            <Select mode="multiple" placeholder="Select event types">
              {/* TODO: load event types from webhook profile for this psp */}
              {selectedPsp &&
                psps &&
                toPspEventTypes(selectedPsp, psps).map(({ label, value }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          {selectedPsp && psps && toPspConfigs(selectedPsp, psps)}
        </Form>
      </Modal>
    </div>
  );
}

function toPspLabels(psps: { [psp: string]: { [version: string]: object } }) {
  return Object.entries(psps).flatMap(([psp, versions]) =>
    Object.keys(versions).map((version) => ({
      label: `${psp} @ ${version}`,
      value: `${psp}@${version}`,
    }))
  );
}

function toPspEventTypes(
  selectedPsp: string,
  psps: {
    [psp: string]: {
      [version: string]: { eventMap: { [coreEvent: string]: string } };
    };
  }
) {
  const [psp, version] = selectedPsp.split("@");
  const filteredCoreEvents = allEventTypes.filter((evt) => {
    return (
      psps[psp] &&
      psps[psp][version] &&
      psps[psp][version].eventMap &&
      psps[psp][version].eventMap[evt]
    );
  });
  return filteredCoreEvents.map((evt) => ({
    label: psps[psp][version].eventMap[evt],
    value: evt,
  }));
}

function toPspConfigs(
  selectedPsp: string,
  psps: {
    [psp: string]: {
      [version: string]: {
        eventMap: { [coreEvent: string]: string };
        configSchema: ConfigField[];
      };
    };
  }
) {
  const [psp, version] = selectedPsp.split("@");
  return psps[psp][version].configSchema.map((field) => (
    <Form.Item
      key={field.name}
      name={field.name}
      label={field.label}
      rules={[{ required: field.required }]}
    >
      {field.type === "text" && <Input autoComplete="off" />}
    </Form.Item>
  ));
}
