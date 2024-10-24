'use client'
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd'
import { ItemType } from 'antd/es/menu/interface';
import React, { ReactElement } from 'react'

const items: ItemType[] = [
    {
        key: 'info',
        label: (
            <div style={{ textAlign: 'center' }}>
                <Avatar size={'large'} src={'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1679802559/instagram-avt-profile/unknow_fc0uaf.jpg'}/>
                <h5>Porter Robinson</h5>
                <p style={{ color: '#666' }}>viethd123456@gmail.com</p>
            </div>
        ),
    },
    {
        key: 'profile',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                Thông tin cá nhân
            </a>
        ),
        icon: <UserOutlined />
    },
    {
        key: 'signOut',
        danger: true,
        label: 'Đăng xuất',
        icon: <PoweroffOutlined />
    }
];

export default function UserDropdown() {
    const handleUserMenuDropdownClick = (e: unknown) => {
        console.log((e as ReactElement).key);
    }

    return (
        <div className='user-menu-nav' style={{ cursor: 'pointer' }}>
            <Dropdown menu={{ items, onClick: handleUserMenuDropdownClick }} trigger={['click']}>
                <Space>
                    <Avatar src={'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1679802559/instagram-avt-profile/unknow_fc0uaf.jpg'} />
                </Space>
            </Dropdown>
        </div>
    )
}
