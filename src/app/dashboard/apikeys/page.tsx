"use client";

import { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Modal, Input, App } from "antd";
import Title from "antd/es/typography/Title";
import { CONTENT_MARGIN, SIDER_WIDTH } from "../layout";
import { createApiKey, getApiKeys, revokeApiKey } from "@/service/api";
import ApiKeyModal from "./newKeyModal";
import { AxiosError } from "axios";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<
    {
      keyId: string;
      name: string;
      key: string;
      createdAt: string;
      lastUsedAt: string | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState("");
  const { message } = App.useApp();
  const [modalLoading, setModalLoading] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getApiKeys();
      setKeys(res);
    } catch {
      message.error("Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async () => {
    if (!newKeyName) {
      return message.warning("Please enter a name for the key");
    }
    try {
      setModalLoading(true);
      const res = await createApiKey(newKeyName);
      setNewKey(res.apiKey);
      setNewKeyName("");
      setCreating(false);
      message.success("API Key created");
      fetchKeys();
    } catch (error) {
      if (((error as Error).cause as AxiosError)?.response?.status === 429) {
        message.error(
          "Anonymous user can only have 1 API key. Sign in to create more."
        );
      } else {
        message.error("Failed to create API key");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      await revokeApiKey(id);
      message.success("API Key revoked");
      fetchKeys();
    } catch {
      message.error("Failed to revoke API key");
    }
  };

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
          API Keys
        </Title>
        <Button type="primary" onClick={() => setCreating(true)}>
          Create API Key{" "}
        </Button>
      </div>

      <Table
        rowKey="keyId"
        dataSource={keys}
        loading={loading}
        columns={[
          { title: "Name", dataIndex: "name" },
          {
            title: "Key",
            dataIndex: "maskedKey",
          },
          {
            title: "Created",
            dataIndex: "createdAt",
            render: (d: string) => new Date(d).toLocaleString(),
          },
          {
            title: "Expires",
            dataIndex: "expiresAt",
            render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
          },
          {
            title: "Last Used",
            dataIndex: "lastUsedAt",
            render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
          },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Button danger onClick={() => revokeKey(record.keyId)}>
                  Revoke
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="Create API Key"
        open={creating}
        onOk={createKey}
        onCancel={() => setCreating(false)}
        okText="Create"
        confirmLoading={modalLoading}
      >
        <Input
          placeholder="Key Name (e.g., Staging App)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
      </Modal>

      <ApiKeyModal
        apiKey={newKey}
        onClose={() => {
          setNewKey("");
        }}
      />
    </div>
  );
}
