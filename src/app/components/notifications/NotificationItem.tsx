'use client'
import styles from './styles/notificationItem.module.css'
import { Avatar } from 'antd'
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
        size={'large'} 
        src={'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1727930250/nestjs-app-images/nwio4jqnowip2lgyz0aq.jpg'}
        style={{ marginRight: '15px' }}    
    />
      <div className={styles['notification-message']}>
        <p>Người dùng dinhhoangviet12a22019@gmail.com vừa đặt 1 đơn hàng.</p>
        <p>8 days ago</p> 
      </div>
    </div>
  )
}
