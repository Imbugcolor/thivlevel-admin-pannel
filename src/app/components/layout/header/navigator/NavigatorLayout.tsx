'use client'
import { BellOutlined, MailOutlined } from '@ant-design/icons'
import { Dropdown, Menu, MenuProps, Space } from 'antd'
import React from 'react'
import NotificationItem from '../../../notifications/NotificationItem'

const menuItemsDropdown1 = [
    {
        key: '0',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                You have new Notifications
            </a>
        ),
    },
    {
        key: '1',
        label: (
            <NotificationItem />
        )
    },
    {
        key: '2',
        label: (
            <p>Nice</p>
        )
    },
]

const menuDropdown1: MenuProps = {
    items: menuItemsDropdown1,
    onClick: () => {},
}

const menuItemsData = [
    {
        items: menuDropdown1,
        icon: BellOutlined,
    },
    {
        items: menuDropdown1,
        icon: MailOutlined,
    }
]

const menuItems: MenuProps['items'] = menuItemsData.map((menu, index) => {
    const key = String(index + 1);
    return {
        key,
        style: { paddingInlineStart: 0, margin: '0 15px', paddingInline: 0 },
        label:
            <Dropdown menu={menu.items} trigger={['click']}>
                <Space>
                    {React.createElement(menu.icon, {style: { fontSize: '18px' }})}
                </Space>
            </Dropdown>
    }
});

export default function NavigatorLayout() {
    return (
        <Menu
            theme="light"
            mode="horizontal"
            selectable={false}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end', borderBottom: 'none' }}
        />
    )
}
