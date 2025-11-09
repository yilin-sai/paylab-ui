import { Card, Button, Row, Col, Steps } from "antd";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const { Step } = Steps;

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>🚀 Welcome to PayLab Developer Console</Title>
      <Paragraph>
        Your all-in-one toolkit for payment developers. Access powerful APIs and
        tools including Mock PSP for simulating transactions, BIN Lookup for
        card insights, and more upcoming utilities — all in one unified
        developer experience.
      </Paragraph>

      {/* Quick Start Guide */}
      <Card title="Quick Start" style={{ marginTop: "2rem" }}>
        <Steps direction="vertical" current={-1}>
          <Step
            title="1. Get an API Key"
            description="Generate your API key in the Console"
          />
          <Step
            title="2. Try Out Our Tools"
            description="Use our interactive API docs to explore and test the APIs"
          />
        </Steps>
      </Card>

      {/* Navigation Cards */}
      <Row gutter={16} style={{ marginTop: "2rem" }}>
        <Col span={8}>
          <Card title="🔑 API Keys" variant="borderless">
            <Paragraph>Manage your API keys for different apps.</Paragraph>
            <Link href="/dashboard/apikeys">
              <Button type="primary">Go to API Keys</Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📘 Mock PSP API" variant="borderless">
            <Paragraph>Learn how to use the Mock PSP API.</Paragraph>
            <Link href="/dashboard/products/mock-psp/docs/canonical">
              <Button type="primary">Try it out</Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📡 BIN Lookup" variant="borderless">
            <Paragraph>Learn how to use the BIN lookup API.</Paragraph>
            <Link href="/dashboard/products/bin-lookup/docs">
              <Button type="primary">Try it out</Button>
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
          href="https://github.com/yilin-sai/paylab-ui/issues"
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
