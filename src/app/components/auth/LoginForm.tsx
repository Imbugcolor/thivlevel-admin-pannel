'use client'
import styles from './login.module.css'
import { Button, Form, Input } from 'antd'
import React from 'react'

export default function LoginForm() {
    const onFinish = (values: string) => {
        console.log(values);
    }

    const onFinishFailed = (errorInfor: unknown) => {
        console.log(errorInfor);
    }

    return (
        <div className={styles['auth-form-container']}>
            <h4 style={{  margin: '15px 0' }}>Đăng nhập</h4>
            <Form
                name="basic"
                layout='vertical'
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
