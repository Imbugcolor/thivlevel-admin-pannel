'use client'
import {userApiRequest} from '@/app/fetch/user.api';
import {setNotify} from '@/libs/features/notifySlice';
import {useAppDispatch, useAppSelector} from '@/libs/hooks';
import {LockOutlined, PoweroffOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Space} from 'antd'
import {ItemType} from 'antd/es/menu/interface';
import React, {ReactElement} from 'react'
import Link from "next/link";
import {UnknowAvatar} from "@/libs/utils/unknow-avatar";

export default function UserDropdown() {
    const token = useAppSelector(state => state.auth).token
    const user = useAppSelector(state => state.auth).user
    const dispatch = useAppDispatch()
    const items: ItemType[] = [
        {
            key: 'info',
            label: (
                <div style={{textAlign: 'center'}}>
                    <Avatar size={'large'}
                            src={user?.avatar || UnknowAvatar }/>
                    <h5>{user?.username}</h5>
                    <p style={{color: '#666'}}>{user?.email}</p>
                </div>
            ),
        },
        {
            key: 'profile',
            label: (
                <Link href="/profile">
                    Thông tin cá nhân
                </Link>
            ),
            icon: <UserOutlined/>
        },
        {
            key: 'security',
            label: (
                <Link href="/profile/security">
                    Bảo mật
                </Link>
            ),
            icon: <LockOutlined />
        },
        {
            key: 'signOut',
            danger: true,
            label: 'Đăng xuất',
            icon: <PoweroffOutlined/>,
        }
    ];
    const handleUserMenuDropdownClick = async (e: unknown) => {
        const navigate = (e as ReactElement).key;
        switch (navigate) {
            case 'signOut':
                if (token) {
                    dispatch(setNotify({loading: true}))
                    try {
                        await userApiRequest.logOut(token, dispatch)
                    } catch (error: any) {
                        console.log("An unexpected error occurred:", error);
                        dispatch(setNotify({error: error.message ? error.message : 'Có lỗi xảy ra'}))
                    } finally {
                        dispatch(setNotify({loading: false}))
                    }
                    // window.location.href = '/auth';
                }
                break;
            default:
                break;
        }

    }

    return (
        <div className='user-menu-nav' style={{cursor: 'pointer'}}>
            <Dropdown menu={{items, onClick: handleUserMenuDropdownClick}} trigger={['click']}>
                <Space>
                    <Avatar
                        src={user?.avatar || UnknowAvatar }/>
                </Space>
            </Dropdown>
        </div>
    )
}
