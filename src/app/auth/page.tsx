import styles from './auth.module.css'
import React from 'react'
import LoginForm from '../components/auth/LoginForm'

export default function Auth() {
    return (
        <div className={styles['auth-container']}>
            <LoginForm />
        </div>
    )
}
