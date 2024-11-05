'use client'
import { useAppSelector } from '@/libs/hooks';
import React, { useEffect } from 'react'
import Loading from '../loading/Loading';
import { notification } from 'antd';

export default function Notify() {
    const alert = useAppSelector(state => state.notify)

    const [notify, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (alert.error) {
            notify.error({ message: alert.error })
        }

        if (alert.success ) {
            notify.success({ message: alert.success })
        }
           
    }, [notify, alert])

    return (
        <div>
            {contextHolder}
            {alert.loading && <Loading />}
        </div>
    )
}