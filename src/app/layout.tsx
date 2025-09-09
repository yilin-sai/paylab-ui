import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { App as AntdApp, ConfigProvider } from "antd";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayLab",
  description: "Payments without the pain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#0070f3",
            },
            components: {
              Layout: {
                siderBg: "#f2f2f2", // Sider background
                triggerBg: "#f2f2f2", // Trigger background
                triggerColor: "black",
              },
              Menu: {
                colorBgContainer: "#f2f2f2", // Menu container background
              },
            },
          }}
        >
          <AntdApp>
            <AntdRegistry>{children}</AntdRegistry>
          </AntdApp>
        </ConfigProvider>
      </body>
    </html>
  );
}
