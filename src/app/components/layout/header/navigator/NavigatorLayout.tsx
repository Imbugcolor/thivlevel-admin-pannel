'use client'
import { BellOutlined, MailOutlined } from '@ant-design/icons'
import { Dropdown, Menu, MenuProps, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import NotificationItem from '../../../notifications/NotificationItem'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import Paginator from '@/app/components/paginator/Paginator'
import { changeNotificationPage, getNotifications } from '@/libs/features/notificationSlice'
import { notificationRequest } from '@/app/fetch/notification.api'


export default function NavigatorLayout() {
    const notifications = useAppSelector(state => state.notification)
    const token = useAppSelector(state => state.auth).token
    const dispatch = useAppDispatch()

    const notificationItems = notifications.data.map((notification, index) => {
        return {
            key: String(index),
            label: (
                <NotificationItem notification={notification} />
            )
        }
    })

    useEffect(() => {
        if (!token) return;
        const fetch = async () => {
            const data = await notificationRequest.get(token, dispatch, 5, notifications.page)// fetch notification
            dispatch(getNotifications({
                ...data.payload,
                page: Number(data.payload.page)
            }))
        }   
        fetch()
    },[token, dispatch, notifications.page])

    const handleChangePage = (page: number) => {
        dispatch(changeNotificationPage(page))
    }

    const menuDropdown1: MenuProps = {
        items: [{ key: 'detail', label: <h5>Thông báo gần đây</h5> },...notificationItems,
            { 
                key: 'paginate', 
                label: 
                <Paginator 
                list={notifications} 
                total={notifications.total} 
                limit={5} 
                callback={handleChangePage}/> ,
            }
        ]
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
                        {React.createElement(menu.icon, { style: { fontSize: '18px' } })}
                    </Space>
                </Dropdown>
        }
    });

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
