'use client'
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function BreadcrumbLayout() {
    const pathname = usePathname(); // Get the current path
    const pathSegments = pathname.split('/').filter(Boolean); // Split path into segments and remove empty

    // Create breadcrumb items based on the path segments
    const breadcrumbItems = [
        {
            title: <Link href="/">Home</Link>,
        }, // Static 'Home' link
        ...pathSegments.map((segment, index) => {
            // Create a dynamic link for each segment
            const url = '/' + pathSegments.slice(0, index + 1).join('/');
            const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
            return {
                title: <Link href={url}>{formattedSegment}</Link>,
            };
        }),
    ];

    return (
        <Breadcrumb
            items={breadcrumbItems}
            style={{ margin: '16px 0' }}
        />
    )
}
