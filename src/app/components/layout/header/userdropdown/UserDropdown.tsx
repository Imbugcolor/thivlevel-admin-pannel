'use client'
import { userApiRequest } from '@/app/fetch/user.api';
import { setNotify } from '@/libs/features/notifySlice';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd'
import { ItemType } from 'antd/es/menu/interface';
import React, { ReactElement } from 'react'

export default function UserDropdown() {
    const token = useAppSelector(state => state.auth).token
    const user = useAppSelector(state => state.auth).user
    const dispatch = useAppDispatch()
    const items: ItemType[] = [
        {
            key: 'info',
            label: (
                <div style={{ textAlign: 'center' }}>
                    <Avatar size={'large'} src={'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1679802559/instagram-avt-profile/unknow_fc0uaf.jpg'}/>
                    <h5>{user?.username}</h5>
                    <p style={{ color: '#666' }}>{user?.email}</p>
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
            icon: <PoweroffOutlined />,
        }
    ];
    const handleUserMenuDropdownClick = async(e: unknown) => {
        const navigate = (e as ReactElement).key;
        switch(navigate) {
            case 'signOut':
                if (token) {
                    dispatch(setNotify({ loading: true }))
                    try {
                        await userApiRequest.logOut(token, dispatch)
                    } catch (error: any) {
                        console.log("An unexpected error occurred:", error);
                        dispatch(setNotify({ error: error.message ? error.message : 'Có lỗi xảy ra' }))
                    }
                    finally {
                        dispatch(setNotify({ loading: false }))
                    }
                    // window.location.href = '/auth';
                }
                break;
            default:
                break;
        }
        
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
