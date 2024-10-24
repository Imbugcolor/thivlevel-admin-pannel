import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import HeaderLayout from "./components/layout/header/HeaderLayout";
import SiderLayout from "./components/layout/sider/SiderLayout";

export const metadata: Metadata = {
  title: "Thivlevel",
  description: "Thivlevel Admin Pannel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <HeaderLayout />
            <SiderLayout>
              {children}
            </SiderLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
