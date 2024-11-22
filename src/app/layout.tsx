import type { Metadata } from "next";
import "./globals.css";
import "react-quill/dist/quill.snow.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import HeaderLayout from "./components/layout/header/HeaderLayout";
import SiderLayout from "./components/layout/sider/SiderLayout";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/libs/interfaces/jwtPayload.interface";
import StoreProvider from "./StoreProvider";
import Notify from "./components/toast/Notify";

export const metadata: Metadata = {
  title: "Thivlevel",
  description: "Thivlevel Admin Pannel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies()
  const token = cookieStore.get('refreshtoken')?.value

  function isAdmin() {
    if (token) {
      const decode: JwtPayload = jwtDecode(token);
        // TRƯỜNG HỢP LÀ ADMIN 
      if (decode.role.some(rl => rl === 'admin')) {
          return true
      }
      return false
    } else {
      return false
    }
  }

  return (
    <html lang="en">
      <body>
      <StoreProvider refreshToken={token}>
        <AntdRegistry>
          <Notify />
          {
            isAdmin() ? <>
              <HeaderLayout />
              <SiderLayout>
                {children}
              </SiderLayout>
            </> : children
          }
        </AntdRegistry>
      </StoreProvider>
      </body>
    </html>
  );
}
