'use client'
import { addNotification } from '@/libs/features/notificationSlice'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import React, { useEffect } from 'react'

export default function Events() {
    const socket = useAppSelector(state => state.client).socket
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (socket) {
            socket.on('sendNotification', (message: any) => {
                console.log(message)
                if (message) {
                    return dispatch(addNotification(message))
                }
            });

            return () => {
                socket.off('sendNotification')
            }
        }
    }, [socket, dispatch])

  return (<></>)
}
