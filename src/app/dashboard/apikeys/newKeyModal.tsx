"use client";

import { Modal, Typography, Button, Space, App } from "antd";
import { useState } from "react";

const { Text, Paragraph } = Typography;

interface ApiKeyModalProps {
  apiKey?: string; // full key returned from server
  onClose: () => void;
}

export default function ApiKeyModal({ apiKey, onClose }: ApiKeyModalProps) {
  const [copied, setCopied] = useState(false);
  const { message } = App.useApp();

  const handleCopy = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      message.success("API key copied to clipboard");
    }
  };

  return (
    <Modal
      title="Your New API Key"
      open={!!apiKey}
      footer={[
        <Button key="copy" onClick={handleCopy} type="primary">
          {copied ? "Copied!" : "Copy Key"}
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      onCancel={onClose}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Paragraph>
          This is the <Text strong>only time</Text> you will see the full API
          key. Please copy and store it securely. You won’t be able to view it
          again.
        </Paragraph>
        <Paragraph copyable={{ text: apiKey }}>
          <Text
            code
            style={{
              fontSize: 16,
              backgroundColor: "#f6f6f6",
              padding: "6px 10px",
            }}
          >
            {apiKey}
          </Text>
        </Paragraph>
      </Space>
    </Modal>
  );
}
