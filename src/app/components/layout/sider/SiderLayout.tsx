'use client'
import { Button, Layout, Menu, MenuProps, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from 'react'
import { DatabaseOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined, ProductOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ContentLayout from '../content/ContentLayout';

interface MenuItem {
    key: string,
    label: React.ReactNode,
    icon?: ForwardRefExoticComponent<Omit<AntdIconProps, "ref"> & RefAttributes<HTMLSpanElement>>,
    children?: MenuItem[] | null,
}
const menuItemsData: MenuItem[] = [
    {
        key: '/',
        label: <Link href={'/'}>Dashboard</Link>,
        icon: PieChartOutlined,
        children: null,
    },
    {
        key: '/products',
        label: 'Sản phẩm',
        icon: ProductOutlined,
        children: [
            {
                key: '/products/list',
                label: <Link href={'/products/list'}>Danh sách</Link>,
            },
            {
                key: '/products/create',
                label: <Link href={'/products/create'}>Tạo mới</Link>,
            },
            {
                key: '/products/deleted',
                label: <Link href={'/products/deleted'}>Đã xóa</Link>,
            }
        ]
    },
    {
        key: '/categories',
        label: <Link href={'/categories'}>Danh mục</Link>,
        icon: DatabaseOutlined,
        children: null,
    }
]

const menuItems: MenuProps['items'] = menuItemsData.map(
    (item) => {
        if (item.children) {
            return {
                key: item.key,
                icon: item.icon ? React.createElement(item.icon) : null,
                label: item.label,

                children: item.children.map((subItem) => {
                    return {
                        key: subItem.key,
                        label: subItem.label,
                    };
                }),
            };
        }

        return {
            key: item.key,
            icon: item.icon ? React.createElement(item.icon) : null,
            label: item.label,
        }
    },
);

export default function SiderLayout({ children }: {
    children: React.ReactNode;
}) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const pathName = usePathname()
    const [collapsed, setCollapsed] = useState(false);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    function getPathSegments(path: string) {
        // Split the path by '/'
        const parts = path.split('/').filter(Boolean); // filter(Boolean) removes any empty parts
        const segments = [];

        // Rebuild the path progressively
        for (let i = 1; i <= parts.length; i++) {
            segments.push('/' + parts.slice(0, i).join('/'));
        }

        return segments;
    }

    useEffect(() => {
        const keys = getPathSegments(pathName);
        setSelectedKeys([pathName])
        setOpenKeys(keys)
    }, [pathName])

    // Handle Submenu toggle
    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    return (
        <Layout style={{ minHeight: '90vh', marginTop: '64px' }}>
            <Sider
                width={200}
                style={{ background: colorBgContainer }}
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={selectedKeys}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    items={menuItems}
                    style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
                />
            </Sider>
            <ContentLayout>
                {children}
            </ContentLayout>
        </Layout>
    )
}
