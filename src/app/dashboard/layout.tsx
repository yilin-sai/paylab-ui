"use client";

import { Button, Layout, Menu } from "antd";
import {
  ApiOutlined,
  DashboardOutlined,
  CloudOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";

const { Header, Sider, Content } = Layout;

export const SIDER_WIDTH = 200;
export const HEADER_HEIGHT = 64;
export const CONTENT_MARGIN = 16;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          fontSize: 20,
          fontWeight: 600,
          color: "#222",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "0 32px",
        }}
      >
        PayLab Developer Console
        {/* add github badge */}
        <a
          href="https://github.com/yilin-sai/paylab-ui"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: 8,
            marginRight: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Repo name badge */}
          <img
            src="https://img.shields.io/badge/GitHub/paylabui-blue?logo=github"
            alt="GitHub Repo"
            style={{ height: 24 }} // Increase badge height
          />
        </a>
        <SignedOut>
          <SignInButton>
            <button
              style={{
                fontSize: "medium",
                fontWeight: 400,
                margin: "0px 8px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </SignInButton>
          <SignUpButton>
            <Button type="primary">Sign up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Header>
      <Layout style={{ paddingTop: HEADER_HEIGHT }}>
        <Sider
          width={SIDER_WIDTH}
          style={{
            position: "fixed",
            top: HEADER_HEIGHT,
            left: 0,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            zIndex: 99,
            overflow: "auto",
            borderRight: "1px solid #e0e0e0", // Light gray border
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={[
              "products",
              "mock-psp",
              "bin-lookup",
              "bsb-lookup",
            ]}
            style={{
              borderRight: "none", // Remove Menu's own border right
            }}
            items={[
              {
                key: "/dashboard",
                icon: <DashboardOutlined />,
                label: <Link href="/dashboard">Dashboard</Link>,
              },
              {
                key: "/dashboard/apikeys",
                icon: <ApiOutlined />,
                label: <Link href="/dashboard/apikeys">API Keys</Link>,
              },
              // {
              //   key: "/dashboard/usage",
              //   icon: <BarChartOutlined />,
              //   label: <Link href="/dashboard/usage">Usage</Link>,
              // },
              {
                key: "products",
                icon: <AppstoreOutlined />,
                label: "Products",
                children: [
                  {
                    key: "bin-lookup",
                    label: "BIN Lookup",
                    children: [
                      {
                        key: "/dashboard/products/bin-lookup/docs",
                        icon: <FileTextOutlined />,
                        label: (
                          <Link href="/dashboard/products/bin-lookup/docs">
                            API Docs
                          </Link>
                        ),
                      },
                    ],
                  },
                  {
                    key: "bsb-lookup",
                    label: "BSB Lookup",
                    children: [
                      {
                        key: "/dashboard/products/bsb-lookup/docs",
                        icon: <FileTextOutlined />,
                        label: (
                          <Link href="/dashboard/products/bsb-lookup/docs">
                            API Docs
                          </Link>
                        ),
                      },
                    ],
                  },
                  {
                    key: "mock-psp",
                    label: "Mock PSP",
                    children: [
                      {
                        key: "/dashboard/products/mock-psp/webhooks",
                        icon: <CloudOutlined />,
                        label: (
                          <Link href="/dashboard/products/mock-psp/webhooks">
                            Webhooks
                          </Link>
                        ),
                      },
                      {
                        key: "/dashboard/products/mock-psp/docs",
                        icon: <FileTextOutlined />,
                        label: (
                          <Link href="/dashboard/products/mock-psp/docs">
                            API Docs
                          </Link>
                        ),
                      },
                    ],
                  },
                ],
              },
            ]}
          />
        </Sider>
        <div
          style={{
            marginLeft: SIDER_WIDTH,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            background: "#f5f5f5",
          }}
        >
          <Content style={{ margin: CONTENT_MARGIN }}>{children}</Content>
        </div>
      </Layout>
    </div>
  );
}
