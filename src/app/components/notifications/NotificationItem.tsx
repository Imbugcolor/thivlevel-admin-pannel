'use client'
import styles from './styles/notificationItem.module.css'
import { Avatar, Typography } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function NotificationItem({ notification }: { notification: NotificationSchema }) {
  const router = useRouter()

  const notificationClick = () => {
    if (notification.target_url) router.push(notification.target_url)
  }

  return (
    <div className={styles['notification-item']} onClick={notificationClick}>
      <Avatar 
        size={52} 
        src={notification.image_url}
        style={{ marginRight: '15px' }}    
        shape='square'
    />
      <div className={styles['notification-message']}>
        <Typography>
          <Typography.Paragraph>{notification.message}</Typography.Paragraph>
          <Typography.Text style={{ color: '#484848' }}>{moment(notification.createdAt).fromNow()}</Typography.Text>
        </Typography>
      </div>
    </div>
  )
}
