"use client";

import { useEffect, useState, useCallback } from "react";
import { Table, Tag, Typography, App } from "antd";
import { useParams } from "next/navigation";
import { getWebhookHistory, usePspApiClient } from "@/service/psp";

const { Title } = Typography;

type Delivery = {
  id: string;
  webhookId: string;
  eventType: string;
  status: "success" | "failed";
  responseCode: number;
  responseBody: string;
  createdAt: string;
};

export default function WebhookHistoryPage() {
  const params = useParams();
  const webhookId = params?.id as string;

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const apiClient = usePspApiClient();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWebhookHistory(webhookId, apiClient);
      setDeliveries(res);
    } catch {
      message.error("Failed to load delivery history");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookId, message]);

  useEffect(() => {
    if (webhookId) {
      fetchHistory();
    }
  }, [webhookId, fetchHistory]);

  return (
    <div>
      <Title level={4}>Webhook Delivery History</Title>
      <Table
        rowKey="id"
        dataSource={deliveries}
        loading={loading}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: "ID", dataIndex: "webhookDeliveryId" },
          { title: "Event", render: (record) => record.transactionEvent.type },
          {
            title: "HTTP Code",
            dataIndex: "statusCode",
            render: (status: number) =>
              status === 200 ? (
                <Tag color="green">200</Tag>
              ) : (
                <Tag color="red">{status}</Tag>
              ),
          },
          {
            title: "Response",
            dataIndex: "responseBody",
            ellipsis: true,
          },
          {
            title: "Delivered At",
            dataIndex: "createdAt",
            render: (date: string) => new Date(date).toLocaleString(),
          },
        ]}
      />
    </div>
  );
}
