import { Card, Button, Row, Col, Steps } from "antd";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const { Step } = Steps;

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>🚀 Welcome to PayLab Mock PSP</Title>
      <Paragraph>
        A lightweight payment simulation API. Create payment intents, simulate
        transactions, and test your webhooks – all without a real PSP.
      </Paragraph>

      {/* Quick Start Guide */}
      <Card title="Quick Start" style={{ marginTop: "2rem" }}>
        <Steps direction="vertical" current={-1}>
          <Step
            title="1. Get an API Key"
            description="Generate your API key in the Console"
          />
          <Step
            title="2. Create a Payment Intent"
            description="Use the API to create a Payment Intent"
          />
          <Step
            title="3. Confirm Payment"
            description="Simulate payment success, decline, or error"
          />
          <Step
            title="4. Receive Webhook"
            description="Get transaction events delivered to your endpoint"
          />
        </Steps>
      </Card>

      {/* Navigation Cards */}
      <Row gutter={16} style={{ marginTop: "2rem" }}>
        <Col span={8}>
          <Card title="🔑 API Keys" bordered={false}>
            <Paragraph>Manage your API keys for different apps.</Paragraph>
            <Link href="/dashboard/apikeys">
              <Button type="primary">Go to API Keys</Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📡 Webhooks" bordered={false}>
            <Paragraph>Configure webhooks and view delivery history.</Paragraph>
            <Link href="/dashboard/webhooks">
              <Button type="primary">Go to Webhooks</Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📘 API Docs" bordered={false}>
            <Paragraph>Learn how to use the Mock PSP API.</Paragraph>
            <Link href="/dashboard/docs">
              <Button type="primary">View Docs</Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          borderTop: "1px solid #f0f0f0",
          marginTop: "2rem",
          backgroundColor: "#fafafa",
        }}
      >
        This project is under <strong>active development</strong>. Feedback and
        issues welcome via{" "}
        <a
          href="https://github.com/yourusername/yourrepo/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Issues
        </a>
        .
      </footer>
    </div>
  );
}
