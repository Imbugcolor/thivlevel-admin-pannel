'use client'
import styles from './styles/notificationItem.module.css'
import { Avatar, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function NotificationItem() {
  const router = useRouter()

  const notificationClick = () => {
    router.push('/products')
  }
  return (
    <div className={styles['notification-item']} onClick={notificationClick}>
      <Avatar 
        size={52} 
        src={'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1727930250/nestjs-app-images/nwio4jqnowip2lgyz0aq.jpg'}
        style={{ marginRight: '15px' }}    
        shape='square'
    />
      <div className={styles['notification-message']}>
        <Typography>
          <Typography.Paragraph>Người dùng dinhhoangviet12a22019@gmail.com vừa đặt 1 đơn hàng.</Typography.Paragraph>
          <Typography.Text style={{ color: '#484848' }}>8 days ago</Typography.Text>
        </Typography>
      </div>
    </div>
  )
}
