'use client'
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import React, { useEffect } from 'react'
import Loading from '../loading/Loading';
import { notification } from 'antd';
import { removeNotify, setNotify } from '@/libs/features/notifySlice';

export default function Notify() {
    const alert = useAppSelector(state => state.notify)
    const dispatch = useAppDispatch()
    const [notify, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (alert.error) {
            notify.error({ message: alert.error })
        }

        if (alert.success ) {
            notify.success({ message: alert.success })
        }

        dispatch(removeNotify())
           
    }, [notify, alert, dispatch])

    return (
        <div>
            {contextHolder}
            {alert.loading && <Loading />}
        </div>
    )
}