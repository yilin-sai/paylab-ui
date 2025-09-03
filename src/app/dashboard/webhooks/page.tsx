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
import { createWebhook, getWebhooks, removeWebhook } from "@/service/psp";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Option } = Select;

type Webhook = {
  webhookSubscriptionId: string;
  url: string;
  transactionEventTypes: string[];
  enabled: boolean;
};

const allEventTypes = [
  "payment.initiated",
  "payment.authorising",
  "payment.authorised",
  "payment.declined",
  "payment.capturing",
  "payment.expired",
  "payment.captured",
  "payment.capture.failed",
];

type WebhookFormValues = {
  url: string;
  events: string[];
};

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<WebhookFormValues>();
  const router = useRouter();
  const { message } = App.useApp();
  const [modalLoading, setModalLoading] = useState(false);

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWebhooks();
      setWebhooks(res);
    } catch {
      message.error("Failed to load webhooks");
    } finally {
      setLoading(false);
    }
  }, [message]);

  const addWebhook = async (values: WebhookFormValues) => {
    try {
      setModalLoading(true);
      await createWebhook(values.url, values.events);
      message.success("Webhook created");
      setModalOpen(false);
      form.resetFields();
      fetchWebhooks();
    } catch {
      message.error("Failed to create webhook");
    } finally {
      setModalLoading(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      await removeWebhook(id);
      message.success("Webhook deleted");
      fetchWebhooks();
    } catch {
      message.error("Failed to delete webhook");
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
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Webhook
        </Button>
      </div>

      <Table
        rowKey="webhookSubscriptionId"
        dataSource={webhooks}
        loading={loading}
        columns={[
          { title: "ID", dataIndex: "webhookSubscriptionId" },
          { title: "URL", dataIndex: "url" },
          {
            title: "Events",
            dataIndex: "transactionEventTypes",
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
              {allEventTypes.map((evt) => (
                <Option key={evt} value={evt}>
                  {evt}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
