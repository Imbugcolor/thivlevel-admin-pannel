import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "Thivlevel Admin Pannel",
};

export default function ProductsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        children
    )
}
