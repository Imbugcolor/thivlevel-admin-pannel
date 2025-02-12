import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin",
  description: "Quản lý thông tin Thivlevel - admin",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
