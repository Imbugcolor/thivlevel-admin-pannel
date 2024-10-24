'use client'
import { Layout, theme } from 'antd'
import { Content } from 'antd/es/layout/layout';
import React from 'react'
import BreadcrumbLayout from '../../breadcrumb/BreadcrumbLayout';

export default function ContentLayout({ children }: {
    children: React.ReactNode;
  }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ padding: '0 24px 24px' }}>
            <BreadcrumbLayout />
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                { children } 
            </Content>
        </Layout>
    )
}
